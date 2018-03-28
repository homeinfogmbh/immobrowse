"""Local real esates application.

This web service is part of ImmoBrowse.
"""

from functools import wraps
from io import BytesIO
from uuid import uuid4

from flask import request, send_file, Flask, Response
from peewee import CharField, ForeignKeyField

from homeinfo.crm import Customer
from immobrowse import DATABASE
from openimmo import factories
from openimmodb import Immobilie, Anhang
from peeweeplus import Model

__all__ = ['APPLICATION']


BASE_URL = 'http://localhost/realestates'
ANHANG_URL = BASE_URL + '/anhang/{}'
APPLICATION = Flask('realestatesd')


class InvalidAccessToken(Exception):
    """Indicates an invalid access token."""

    pass


def authorized(function):
    """Validates the provided access token."""

    @wraps(function)
    def wrapper(*args, **kwargs):
        """Wraps the respective function."""
        try:
            AccessToken.validate(request.args['token'])
        except KeyError:
            raise InvalidAccessToken()

        return function(*args, **kwargs)

    return wrapper


@APPLICATION.route('/anbieter/<int:cid>', methods=['GET'])
@authorized
def _anbieter(cid):
    """Returns the respective realtor as XML."""

    try:
        customer = Customer.get(Customer.cid == cid)
    except Customer.DoesNotExist:
        return ('No such customer.', 404)

    anbieter = factories.anbieter(customer.cid, customer.name)

    for immobilie in Immobilie.select().where(Immobilie.customer == customer):
        attachments = [
            anhang.remote(ANHANG_URL) for anhang in immobilie.anhang]
        anbieter.immobilie.append(immobilie.to_dom(attachments=attachments))

    return Response(anbieter.toxml(), mimetype='text/xml')


@APPLICATION.route('/anhang/<int:ident>', methods=['GET'])
@authorized
def _anhang(ident):
    """Returns the respective attachment."""

    try:
        anhang = Anhang.get(Anhang.id == ident)
    except Anhang.DoesNotExist:
        return ('No such attachment.', 404)

    return send_file(BytesIO(anhang.data), mimetype=anhang.format)


@APPLICATION.errorhandler(InvalidAccessToken)
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
        on_change='CASCADE')
    token = CharField(36, default=lambda: str(uuid4()))

    @classmethod
    def validate(cls, token, customer=None):
        """Validates the respective token."""
        customer_expr = True if customer is None else cls.customer == customer

        try:
            cls.get((cls.token == token) & customer_expr)
        except cls.DoesNotExist:
            raise InvalidAccessToken()

        return True
