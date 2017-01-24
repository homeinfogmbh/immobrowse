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
            raise Error('No such real estate: {}'.format(ident)) from None
        else:
            if immobilie.approve(PORTAL):
                if immobilie.active:
                    return JSON(immobilie.to_dict())
                else:
                    raise Error('Real estate is not active') from None
            else:
                raise Error('Real estate not allowed on this portal') from None


def attachment(real_estate, sha256sum):
    """Returns the respective attachment"""

    if sha256sum is None:
        return Anhang.select().where(Anhang.immobilie == real_estate)
    else:
        try:
            return Anhang.get(
                (Anhang._immobilie == real_estate) &
                (Anhang.sha256sum == sha256sum))
        except DoesNotExist:
            raise Error('No such attachment: {}'.format(sha256sum)) from None


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

    def _filtered_real_estates_for(self, customer):
        """Yields filtered real estates for the specified customer"""
        for immobilie in Immobilie.of(customer):
            if immobilie.approve('immobrowse') and immobilie.active:
                yield immobilie

    def _real_estates_for(self, customer):
        """Yields real estates for the specified customer"""
        try:
            settings = Settings.get(Settings.customer == customer)
        except DoesNotExist:
            raise Error(
                'Customer not unlocked for ImmoBrowse',
                status=403) from None
        else:
            if settings.override is None:
                yield from self._filtered_real_estates_for(customer)
            elif settings.override:
                for immobilie in Immobilie.of(customer):
                    yield immobilie

    def get(self):
        """Retrieves real estates"""
        return JSON({
            'immobilie': [r.to_dict() for r in
                          self._real_estates_for(customer(self.resource))]})


class RealEstateHandler(ResourceHandler):
    """Handles requests on single real estates"""

    def get(self):
        """Returns real estate details data"""
        immobilie = real_estate(
            customer(self.query.get('customer')),
            self.resource)
        return JSON(immobilie.to_dict())


class AttachmentHandler(ResourceHandler):
    """Handles requests on attachments"""

    def get(self):
        """Returns the respective attachment"""
        anhang = attachment(
            real_estate(
                customer(self.query.get('customer')),
                self.query.get('objektnr_extern')),
            self.resource)

        return Binary(anhang.data)


HANDLERS = {
    'list': ListHandler,
    'real_estate': RealEstateHandler,
    'attachment': AttachmentHandler}
