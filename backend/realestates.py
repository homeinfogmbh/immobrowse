"""Local real esates application.

This web service is part of ImmoBrowse.
"""

from io import BytesIO

from flask import send_file, Flask, Response

from homeinfo.crm import Customer
from openimmo import factories
from openimmodb import Immobilie, Anhang

__all__ = ['APPLICATION']


BASE_URL = 'http://localhost/realestates'
ANHANG_URL = BASE_URL  + '/anhang/{}'
APPLICATION = Flask('realestatesd')


@APPLICATION.route('/anbieter/<int:cid>', methods=['GET'])
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
def _anhang(ident):
    """Returns the respective attachment."""

    try:
        anhang = Anhang.get(Anhang.id == ident)
    except Anhang.DoesNotExist:
        return ('No such attachment.', 404)

    return send_file(BytesIO(anhang.data), mimetype=anhang.format)


if __name__ == '__main__':
    APPLICATION.run('127.0.0.1', 9000)