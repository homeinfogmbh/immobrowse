"""ImmoBrowse real estate backend.

This web service is part of ImmoBrowse.
"""
from datetime import datetime
from json import dumps
from os import linesep
from tempfile import NamedTemporaryFile

from flask import make_response, jsonify, Response

from mdb import Customer
from mimeutil import mimetype
from openimmodb import Immobilie, Anhang
from wsgilib import Application

from immobrowse.orm import Override


__all__ = ['APPLICATION']


PORTALS = ('immobrowse', 'homepage', 'website')
APPLICATION = Application('immobrowse', cors=True, debug=True)
_DEBUG_FILE = NamedTemporaryFile(
    'a', prefix='immobrowse_', suffix='.log', delete=False)


print('DEBUG: Logging to file:', _DEBUG_FILE.name, flush=True)


def _debug(text, end=linesep):
    """Writes text to a debug file."""

    with _DEBUG_FILE as debug:
        debug.write('[{}]\t'.format(datetime.now()))
        debug.write(text)
        debug.write(end)


def real_estates_of(customer):
    """Yields real estates of the respective customer."""

    for immobilie in Immobilie.by_customer(customer):
        if immobilie.active and approve(immobilie, PORTALS):
            yield immobilie


def approve(immobilie, portals):
    """Chekcs whether the real estate is in any of the portals."""

    try:
        Override.get(Override.customer == immobilie.customer)
    except Override.DoesNotExist:
        return any(immobilie.approve(portal) for portal in portals)

    return True


@APPLICATION.route('/list/<int:cid>')
def get_list(cid):
    """Returns the respective real estate list."""

    _debug('Getting customer.')

    try:
        customer = Customer.get(Customer.id == cid)
    except Customer.DoesNotExist:
        _debug('Customer does not exist.')
        return ('No such customer: {}.'.format(cid), 404)

    real_estates = []
    _debug('Getting real estates.')

    for real_estate in real_estates_of(customer):
        _debug('Converting real estate to JSON.')
        real_estate = real_estate.to_dict(limit=True)
        _debug('Converted real estate to JSON.')

    _debug('Generating response.')
    response = Response(dumps(real_estates), mimetype='application/json')
    _debug('Returning response.')
    return response


@APPLICATION.route('/expose/<int:ident>')
def get_expose(ident):
    """Returns the respective detail expose."""

    try:
        immobilie = Immobilie.get(Immobilie.id == ident)
    except Immobilie.DoesNotExist:
        return ('No such real estate: {}.'.format(ident), 404)

    if approve(immobilie, PORTALS):
        if immobilie.active:
            return jsonify(immobilie.to_dict(limit=True))

        return ('Real estate is not active.', 404)

    return ('Real estate not cleared for portal.', 403)


@APPLICATION.route('/attachment/<int:ident>')
def get_attachment(ident):
    """Returns the respective attachment."""

    try:
        anhang = Anhang.get(Anhang.id == ident)
    except Anhang.DoesNotExist:
        return ('No such attachment: {}'.format(ident), 404)

    if approve(anhang.immobilie, PORTALS):
        data = anhang.data
        response = make_response(data)
        response.headers['Content-Type'] = mimetype(data)
        return response

    return ('Related real estate not cleared for portal.', 403)
