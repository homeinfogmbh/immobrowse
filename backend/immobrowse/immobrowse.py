"""ImmoBrowse real estate backend.

This web service is part of ImmoBrowse.
"""
from datetime import datetime
from json import dumps
from os import linesep

from flask import make_response, jsonify, Response

from mdb import Customer
from mimeutil import mimetype
from openimmodb import Immobilie, Anhang
from wsgilib import Application

from immobrowse.orm import Override


__all__ = ['APPLICATION']


PORTALS = ('immobrowse', 'homepage', 'website')
APPLICATION = Application('immobrowse', cors=True, debug=True)


class DebugTime:
    """Measures time of an operation."""

    def __init__(self, caption):
        self.caption = caption
        self.start = None
        self.end = None

    def __enter__(self):
        self.start = datetime.now()

    def __exit__(self, *_):
        self.end = datetime.now()
        self.write()

    @property
    def duration(self):
        """Returns the measured duration."""
        return self.end - self.start

    def write(self, end=linesep):
        """Writes the duration to the log file."""
        print('DEBUG:', '[{}]\t{}'.format(datetime.now(), self.caption),
              'took', '{}.{}'.format(self.duration, end), flush=True)


def has_override(customer):
    """Checks if the customer has an override."""

    try:
        Override.get(Override.customer == customer)
    except Override.DoesNotExist:
        return False

    return True


def approve(immobilie, override=None):
    """Chekcs whether the real estate is in any of the portals."""

    if override:
        return True

    if override is None and has_override(immobilie.customer):
        return True

    return any(immobilie.approve(portal) for portal in PORTALS)


def real_estates_of(customer):
    """Yields real estates of the respective customer."""

    override = has_override(customer)

    for immobilie in Immobilie.by_customer(customer):
        if immobilie.active and approve(immobilie, override=override):
            yield immobilie


@APPLICATION.route('/list/<int:cid>')
def get_list(cid):
    """Returns the respective real estate list."""

    with DebugTime('Getting customer.'):
        try:
            customer = Customer.get(Customer.id == cid)
        except Customer.DoesNotExist:
            return ('No such customer: {}.'.format(cid), 404)

    real_estates = []

    with DebugTime('Getting real estates.'):
        for real_estate in real_estates_of(customer):
            with DebugTime('Converting real estate to JSON.'):
                real_estate = real_estate.to_dict(limit=True)

            with DebugTime('Appending JSON real estate to list.'):
                real_estates.append(real_estate)

    with DebugTime('Generating response.'):
        response = Response(dumps(real_estates), mimetype='application/json')

    return response


@APPLICATION.route('/expose/<int:ident>')
def get_expose(ident):
    """Returns the respective detail expose."""

    try:
        immobilie = Immobilie.get(Immobilie.id == ident)
    except Immobilie.DoesNotExist:
        return ('No such real estate: {}.'.format(ident), 404)

    if approve(immobilie):
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

    if approve(anhang.immobilie):
        data = anhang.data
        response = make_response(data)
        response.headers['Content-Type'] = mimetype(data)
        return response

    return ('Related real estate not cleared for portal.', 403)
