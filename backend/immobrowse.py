"""ImmoBrowse real estate backend"""

from configparser import ConfigParser

from peewee import DoesNotExist, Model, PrimaryKeyField, ForeignKeyField

from peeweeplus import MySQLDatabase
from wsgilib import Error, JSON, Binary, ResourceHandler
from homeinfo.crm import Customer

from openimmodb import Immobilie, Anhang

__all__ = ['HANDLERS']

PORTAL = 'immobrowse'

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


def override(customer):
    """Determines portal override check for the respective customer"""

    try:
        Override.get(Override.customer == customer)
    except DoesNotExist:
        return False
    else:
        return True


def approve(immobilie, portals):
    """Chekcs whether the real estate is in any of the portals"""

    return any(immobilie.approve(portal) for portal in portals)


def real_estate(customer, ident, portals):
    """Returns the reapective real estate for the customer"""

    if ident is None:
        raise Error('No real estate specified') from None
    else:
        try:
            immobilie = Immobilie.get(
                (Immobilie.customer == customer) &
                (Immobilie.objektnr_extern == ident))
        except DoesNotExist:
            raise Error('No such real estate: {}'.format(ident),
                        status=404) from None
        else:
            if override(customer) or approve(immobilie, portals):
                if immobilie.active:
                    return immobilie
                else:
                    raise Error('Real estate is not active',
                                status=403) from None
            else:
                raise Error('Real estate not cleared for portal.',
                            status=403) from None


def real_estates(customer, portals):
    """Yields real estates of the respective customer"""

    for immobilie in Immobilie.of(customer):
        if immobilie.active:
            if override(customer) or approve(immobilie, portals):
                yield immobilie


def barrierfree(portals):
    """Yields barrier free real estates"""

    for immobilie in Immobilie:
        if approve(immobilie, portals):
            try:
                barrier_freeness = immobilie.barrier_freeness
            except DoesNotExist:
                continue
            else:
                if barrier_freeness.complete or barrier_freeness.limited:
                    yield immobilie


def attachment(real_estate, ident):
    """Returns the respective attachment"""

    if ident is None:
        return Anhang.select().where(Anhang.immobilie == real_estate)
    else:
        try:
            return Anhang.get(
                (Anhang._immobilie == real_estate) &
                (Anhang.id == ident))
        except DoesNotExist:
            raise Error('No such attachment: {}'.format(ident),
                        status=404) from None


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


class ImmobrowseHandler(ResourceHandler):
    """Common, abstract portals handler"""

    @property
    def portals(self):
        """Yields the requested portals"""
        try:
            portals = self.query['portals']
        except KeyError:
            yield PORTAL
        else:
            for portal in portals.split(','):
                yield portal.strip()
                self.logger.info('PORTAL: {}'.format(portal.strip()))


class ListHandler(ImmobrowseHandler):
    """Handles real estate list queries for customers"""

    def get(self):
        """Retrieves real estates"""
        return JSON([r.to_dict(limit=True) for r in real_estates(
            customer(self.resource), self.portals)])


class BarrierfreeHandler(ImmobrowseHandler):
    """Handles real estate list queries for customers"""

    def get(self):
        """Retrieves real estates"""
        return JSON([r.to_dict(limit=True) for r in barrierfree(self.portals)])


class RealEstateHandler(ImmobrowseHandler):
    """Handles requests on single real estates"""

    def get(self):
        """Returns real estate details data"""
        immobilie = real_estate(
            customer(self.query.get('customer')),
            self.resource, self.portals)
        return JSON(immobilie.to_dict(limit=True))


class AttachmentHandler(ImmobrowseHandler):
    """Handles requests on attachments"""

    def get(self):
        """Returns the respective attachment"""
        real_estate_ = real_estate(
            customer(self.query.get('customer')),
            self.query.get('objektnr_extern'), self.portals)

        try:
            ident = int(self.resource)
        except TypeError:
            for anhang in attachment(real_estate_, None):
                # TODO: implement
                pass
        except ValueError:
            raise Error('Invalid attachment id: {}.'.format(
                self.resource)) from None
        else:
            anhang = attachment(real_estate_, ident)
            return Binary(anhang.data)


HANDLERS = {
    'list': ListHandler,
    'barrierfree': BarrierfreeHandler,
    'real_estate': RealEstateHandler,
    'attachment': AttachmentHandler}
