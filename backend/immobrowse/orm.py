"""Object relational mappings."""

from uuid import uuid4

from peewee import CharField, ForeignKeyField, Model

from mdb import Customer
from peeweeplus import MySQLDatabaseProxy


DATABASE = MySQLDatabaseProxy("immobrowse")


__all__ = ["AccessToken", "Override"]


class ImmoBrowseModel(Model):
    """Basic ORM model for ImmoBrowse."""

    class Meta:  # pylint: disable=C0111,R0903
        database = DATABASE


class AccessToken(ImmoBrowseModel):
    """Access tokens for customers."""

    class Meta:  # pylint: disable=C0111,R0903
        table_name = "access_token"

    customer = ForeignKeyField(
        Customer, column_name="customer", on_delete="CASCADE", on_update="CASCADE"
    )
    token = CharField(36, default=lambda: str(uuid4()))


class Override(ImmoBrowseModel):
    """Customer overrides for ImmoBrowse."""

    customer = ForeignKeyField(Customer, column_name="customer")
