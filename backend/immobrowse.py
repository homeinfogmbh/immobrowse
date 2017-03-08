"""ImmoBrowse real estate backend"""

from peewee import DoesNotExist, Model, PrimaryKeyField, ForeignKeyField, \
    BooleanField

from homeinfo.peewee import MySQLDatabase
from homeinfo.lib.rest import ResourceHandler
from homeinfo.lib.wsgi import Error, JSON, Binary
from homeinfo.crm import Customer

from openimmodb import Immobilie, Anhang

__all__ = ['HANDLERS']

PORTAL = 'immobrowse'


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


def settings(customer):
    """Returns the settings for the respective customer"""

    try:
        return Settings.get(Settings.customer == customer)
    except DoesNotExist:
        raise Error('Customer not unlocked for ImmoBrowse',
                    status=403) from None


def real_estate(customer, ident):
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
            if immobilie.active:
                if settings(customer).override or immobilie.approve(PORTAL):
                    return immobilie
                else:
                    raise Error('Real estate not allowed on this portal',
                                status=403) from None
            else:
                raise Error('Real estate is not active', status=403) from None


def real_estates(customer):
    """Yields real estates of the respective customer"""

    override = settings(customer).override

    for immobilie in Immobilie.of(customer):
        if immobilie.active:
            if override or immobilie.approve(PORTAL):
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
            'immobrowse',
            host='localhost',
            user='immobrowse',
            passwd='SAgNBGNXf4uWTn47',
            closing=True)

    id = PrimaryKeyField()


class Settings(ImmoBrowseModel):
    """Customer settings for ImmoBrowse"""

    class Meta:
        db_table = 'settings'

    customer = ForeignKeyField(Customer, db_column='customer')
    override = BooleanField(null=True, default=None)


class ListHandler(ResourceHandler):
    """Handles real estate list queries for customers"""

    def get(self):
        """Retrieves real estates"""
        return JSON([r.to_dict(limit=True) for r in real_estates(
            customer(self.resource))])


class RealEstateHandler(ResourceHandler):
    """Handles requests on single real estates"""

    def get(self):
        """Returns real estate details data"""
        immobilie = real_estate(
            customer(self.query.get('customer')),
            self.resource)
        return JSON(immobilie.to_dict(limit=True))


class AttachmentHandler(ResourceHandler):
    """Handles requests on attachments"""

    def get(self):
        """Returns the respective attachment"""
        real_estate_ = real_estate(
            customer(self.query.get('customer')),
            self.query.get('objektnr_extern'))

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
    'real_estate': RealEstateHandler,
    'attachment': AttachmentHandler}
