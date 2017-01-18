"""ImmoBrowse real estate backend"""

from peewee import DoesNotExist, Model, PrimaryKeyField, ForeignKeyField, \
    BooleanField

from homeinfo.lib.rest import ResourceHandler
from homeinfo.lib.wsgi import JSON, Error
from homeinfo.crm import Customer

from openimmodb import Immobilie


class ImmoBrowseModel(Model):
    """Basic ORM model for ImmoBrowse"""

    id = PrimaryKeyField()


class Settings(ImmoBrowseModel):
    """Customer settings for ImmoBrowse"""

    class Meta:
        db_table = 'settings'

    customer = ForeignKeyField(Customer, db_column='customer')
    override = BooleanField(null=True, default=None)


class ImmoBrowse(ResourceHandler):
    """Handles real estate queries for customers"""

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
            yield from self._filtered_real_estates_for(customer)
        else:
            if settings.override is None:
                yield from self._filtered_real_estates_for(customer)
            elif settings.override:
                for immobilie in Immobilie.of(customer):
                    yield immobilie

    def get(self):
        """Retrieves real estates"""
        if self.resource is None:
            raise Error('No customer specified') from None
        else:
            try:
                cid = int(self.resource)
            except ValueError:
                raise Error('Invalid customer ID: {}'.format(
                    self.resource)) from None
            else:
                try:
                    customer = Customer.get(Customer.id == cid)
                except DoesNotExist:
                    raise Error('No such customer: {}'.format(cid)) from None
                else:
                    real_estates = list(self._real_estates_for(customer))
                    json = {'immobilie': [r.to_dict() for r in real_estates]}
                    return JSON(json)
