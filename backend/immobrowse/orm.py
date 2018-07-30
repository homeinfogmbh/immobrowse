"""Object relational mappings."""

from peewee import Model, PrimaryKeyField, ForeignKeyField

from mdb import Customer
from peeweeplus import MySQLDatabase

from immobrowse.config import CONFIG


DATABASE = MySQLDatabase.from_config(CONFIG['db'])


__all__ = ['ImmoBrowseModel', 'Override']


class ImmoBrowseModel(Model):
    """Basic ORM model for ImmoBrowse."""

    class Meta:
        database = DATABASE

    id = PrimaryKeyField()


class Override(ImmoBrowseModel):
    """Customer overrides for ImmoBrowse."""

    customer = ForeignKeyField(Customer, column_name='customer')
