"""ImmoBrowse real estate backend."""

from configparser import ConfigParser

from peewee import DoesNotExist, Model, PrimaryKeyField, ForeignKeyField

from peeweeplus import MySQLDatabase
from wsgilib import Error, JSON, Binary, RestHandler, Route, Router
from homeinfo.crm import Customer

from openimmodb import Immobilie, Anhang

__all__ = ['ROUTER']

PORTALS = ('immobrowse', 'homepage', 'website')

CONFIG = ConfigParser()
CONFIG.read('/etc/immobrowse.conf')


def get_customer(cid):
    """Returns a customer for the respective string."""

    try:
        return Customer.get(Customer.id == cid)
    except DoesNotExist:
        raise Error('No such customer: {}'.format(cid)) from None


def approve(immobilie, portals):
    """Chekcs whether the real estate is in any of the portals."""

    try:
        Override.get(Override.customer == immobilie.customer)
    except DoesNotExist:
        return any(immobilie.approve(portal) for portal in portals)
    else:
        return True


def real_estates_of(customer):
    """Yields real estates of the respective customer."""

    for immobilie in Immobilie.by_customer(customer):
        if immobilie.active and approve(immobilie, PORTALS):
            yield immobilie


def get_expose(ident):
    """Returns the reapective real estate for the customer."""

    if ident is None:
        raise Error('No real estate specified.') from None
    else:
        try:
            immobilie = Immobilie.get(Immobilie.id == ident)
        except DoesNotExist:
            raise Error('No such real estate: {}.'.format(ident),
                        status=404) from None
        else:
            if approve(immobilie, PORTALS):
                if immobilie.active:
                    return immobilie

                raise Error('Real estate is not active.', status=403) from None

            raise Error('Real estate not cleared for portal.',
                        status=403) from None


def attachment(ident):
    """Returns the respective attachment."""

    try:
        anhang = Anhang.get(Anhang.id == ident)
    except DoesNotExist:
        raise Error('No such attachment: {}'.format(ident),
                    status=404) from None
    else:
        if approve(anhang.immobilie, PORTALS):
            return anhang

        raise Error('Related real estate not cleared for portal.') from None


class ImmoBrowseModel(Model):
    """Basic ORM model for ImmoBrowse."""

    class Meta:
        database = MySQLDatabase(
            CONFIG['db']['database'],
            host=CONFIG['db']['host'],
            user=CONFIG['db']['user'],
            passwd=CONFIG['db']['passwd'],
            closing=True)

    id = PrimaryKeyField()


class Override(ImmoBrowseModel):
    """Customer overrides for ImmoBrowse."""

    customer = ForeignKeyField(Customer, db_column='customer')


class ListHandler(RestHandler):
    """Handles real estate list queries for customers."""

    def get(self):
        """Retrieves real estates."""
        return JSON([r.to_dict(limit=True) for r in real_estates_of(
            get_customer(self.vars['id']))])


class ExposeHandler(RestHandler):
    """Handles requests on single real estates."""

    def get(self):
        """Returns real estate details data."""
        return JSON(get_expose(self.vars['id']).to_dict(limit=True))


class AttachmentHandler(RestHandler):
    """Handles requests on attachments."""

    def get(self):
        """Returns the respective attachment."""
        return Binary(attachment(self.vars['id']).data)


ROUTER = Router(
    (Route('/immobrowse/list'), ListHandler),
    (Route('/immobrowse/expose/<id:int>'), ExposeHandler),
    (Route('/immobrowse/attachment/<id:int>'), AttachmentHandler))
