"""ImmoBrowse real estate backend"""

from configparser import ConfigParser

from peewee import DoesNotExist, Model, PrimaryKeyField, ForeignKeyField

from peeweeplus import MySQLDatabase
from wsgilib import Error, JSON, Binary, ResourceHandler
from homeinfo.crm import Customer

from openimmodb import Immobilie, Anhang

__all__ = ['HANDLERS']

PORTALS = ('immobrowse', 'homepage', 'website')

config = ConfigParser()
config.read('/etc/immobrowse.conf')


def customer(ident):
    """Returns a customer for the respective string"""

    try:
        cid = int(ident)
    except TypeError:
        raise Error('No customer specified') from None
    except ValueError:
        raise Error('Invalid customer ID: {}'.format(ident)) from None
    else:
        try:
            return Customer.get(Customer.id == cid)
        except DoesNotExist:
            raise Error('No such customer: {}'.format(cid)) from None


def approve(immobilie, portals):
    """Chekcs whether the real estate is in any of the portals"""

    if any(immobilie.approve(portal) for portal in portals):
        return True
    else:
        try:
            Override.get(Override.customer == immobilie.customer)
        except DoesNotExist:
            return False
        else:
            return True


def real_estates_of(customer):
    """Yields real estates of the respective customer"""

    for immobilie in Immobilie.of(customer):
        if immobilie.active:
            if approve(immobilie, PORTALS):
                yield immobilie


def expose(ident):
    """Returns the reapective real estate for the customer"""

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
                else:
                    raise Error('Real estate is not active.',
                                status=403) from None
            else:
                raise Error('Real estate not cleared for portal.',
                            status=403) from None


def attachment(ident):
    """Returns the respective attachment"""

    try:
        anhang = Anhang.get(Anhang.id == ident)
    except DoesNotExist:
        raise Error('No such attachment: {}'.format(ident),
                    status=404) from None
    else:
        if approve(anhang.immobilie, PORTALS):
            return anhang
        else:
            raise Error(
                'Related real estate not cleared for portal.') from None


class ImmoBrowseModel(Model):
    """Basic ORM model for ImmoBrowse"""

    class Meta:
        database = MySQLDatabase(
            config['db']['database'],
            host=config['db']['host'],
            user=config['db']['user'],
            passwd=config['db']['passwd'],
            closing=True)

    id = PrimaryKeyField()


class Override(ImmoBrowseModel):
    """Customer overrides for ImmoBrowse"""

    customer = ForeignKeyField(Customer, db_column='customer')


class ListHandler(ResourceHandler):
    """Handles real estate list queries for customers"""

    def get(self):
        """Retrieves real estates"""
        return JSON([r.to_dict(limit=True) for r in real_estates_of(
            customer(self.resource))])


class ExposeHandler(ResourceHandler):
    """Handles requests on single real estates"""

    def get(self):
        """Returns real estate details data"""
        return JSON(expose(int(self.resource)).to_dict(limit=True))


class AttachmentHandler(ResourceHandler):
    """Handles requests on attachments"""

    def get(self):
        """Returns the respective attachment"""
        try:
            ident = int(self.resource)
        except (TypeError, ValueError):
            raise Error('Invalid attachment ID: {}.'.format(
                self.resource)) from None
        else:
            return Binary(attachment(ident).data)


HANDLERS = {
    'list': ListHandler,
    'expose': ExposeHandler,
    'attachment': AttachmentHandler}
