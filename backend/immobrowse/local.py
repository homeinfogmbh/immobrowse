"""Local real esates application.

This web service is part of ImmoBrowse.
"""
from functools import wraps
from io import BytesIO
from typing import Callable

from flask import request, send_file, Flask, Response

from mdb import Customer
from openimmo import anbieter
from openimmodb import Immobilie, Anhang
from wsgilib import JSONMessage

from immobrowse.orm import AccessToken


__all__ = ['APPLICATION']


BASE_URL = 'http://backend.homeinfo.de/realestates'
ANHANG_URL = BASE_URL + '/anhang/{}'
APPLICATION = Flask('realestatesd')


class UnauthorizedError(Exception):
    """Indicates that the respective request is unauthorized."""


def authorized(function: Callable) -> Callable:
    """Validates the provided access token."""

    @wraps(function)
    def wrapper(*args, **kwargs):
        """Wraps the respective function."""
        try:
            token = AccessToken.get(AccessToken.token == request.args['token'])
        except (KeyError, AccessToken.DoesNotExist):
            raise UnauthorizedError() from None

        return function(token.customer, *args, **kwargs)

    return wrapper


@APPLICATION.route('/anbieter', methods=['GET'])
@authorized
def _anbieter(customer: Customer) -> Response:
    """Returns the respective realtor as XML."""

    result = anbieter(
        anbieternr=repr(customer), firma=str(customer),
        openimmo_anid=repr(customer))

    for immobilie in Immobilie.select().where(Immobilie.customer == customer):
        attachments = [
            anhang.remote(ANHANG_URL) for anhang in immobilie.anhang]
        result.immobilie.append(immobilie.to_dom(attachments=attachments))

    return Response(result.toxml(), mimetype='text/xml')


@APPLICATION.route('/anhang/<int:ident>', methods=['GET'])
@authorized
def _anhang(customer: Customer, ident: int) -> Response:
    """Returns the respective attachment."""

    try:
        anhang = Anhang.select().join(Immobilie).where(
            (Anhang.id == ident) & (Immobilie.customer == customer)).get()
    except Anhang.DoesNotExist:
        return JSONMessage('No such attachment.', status=404)

    return send_file(BytesIO(anhang.bytes), mimetype=anhang.format)


@APPLICATION.errorhandler(UnauthorizedError)
def _handle_invalid_access_token(_):
    """Handles the respective error."""

    return JSONMessage('Unauthorized.', status=403)
