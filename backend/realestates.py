"""Local real esates application.

This web service is part of ImmoBrowse.
"""

from functools import wraps
from io import BytesIO
from uuid import uuid4

from flask import request, send_file, Flask, Response
from peewee import Model, ForeignKeyField, CharField

from immobrowse import DATABASE
from mdb import Customer
from openimmo import factories
from openimmodb import Immobilie, Anhang

__all__ = ['APPLICATION']


BASE_URL = 'http://backend.homeinfo.de/realestates'
ANHANG_URL = BASE_URL + '/anhang/{}'
APPLICATION = Flask('realestatesd')


class UnauthorizedError(Exception):
    """Indicates that the respective request is unauthorized."""

    pass


def authorized(function):
    """Validates the provided access token."""

    @wraps(function)
    def wrapper(*args, **kwargs):
        """Wraps the respective function."""
        try:
            token = AccessToken.get(AccessToken.token == request.args['token'])
        except KeyError:
            raise UnauthorizedError()

        return function(token.customer, *args, **kwargs)

    return wrapper


@APPLICATION.route('/anbieter', methods=['GET'])
@authorized
def _anbieter(customer):
    """Returns the respective realtor as XML."""

    anbieter = factories.anbieter(customer.cid, customer.name)

    for immobilie in Immobilie.select().where(Immobilie.customer == customer):
        attachments = [
            anhang.remote(ANHANG_URL) for anhang in immobilie.anhang]
        anbieter.immobilie.append(immobilie.to_dom(attachments=attachments))

    return Response(anbieter.toxml(), mimetype='text/xml')


@APPLICATION.route('/anhang/<int:ident>', methods=['GET'])
@authorized
def _anhang(customer, ident):
    """Returns the respective attachment."""

    try:
        anhang = Anhang.select().join(Immobilie).where(
            (Anhang.id == ident) & (Immobilie.customer == customer)).get()
    except Anhang.DoesNotExist:
        return ('No such attachment.', 404)

    return send_file(BytesIO(anhang.data), mimetype=anhang.format)


@APPLICATION.errorhandler(UnauthorizedError)
def _handle_invalid_access_token(_):
    """Handles the respective error."""

    return ('Unauthorized.', 403)


class AccessToken(Model):
    """Access tokens for customers."""

    class Meta:
        database = DATABASE
        table_name = 'access_token'

    customer = ForeignKeyField(
        Customer, column_name='customer', on_delete='CASCADE',
        on_update='CASCADE')
    token = CharField(36, default=lambda: str(uuid4()))

    @classmethod
    def validate(cls, token, customer=None):
        """Validates the respective token."""
        customer_expr = True if customer is None else cls.customer == customer

        try:
            cls.get((cls.token == token) & customer_expr)
        except cls.DoesNotExist:
            raise UnauthorizedError()

        return True
