"""ImmoBrowse real estate backend.

This web service is part of ImmoBrowse.
"""

from configparser import ConfigParser
from json import dumps

from flask import make_response, jsonify, Response
from peewee import Model, PrimaryKeyField, ForeignKeyField

from homeinfo.crm import Customer
from mimeutil import mimetype
from peeweeplus import MySQLDatabase

from openimmodb import Immobilie, Anhang
from wsgilib import Application

__all__ = ['APPLICATION', 'DATABASE']

PORTALS = ('immobrowse', 'homepage', 'website')
CONFIG = ConfigParser()
CONFIG.read('/etc/immobrowse.conf')
APPLICATION = Application('immobrowse', cors=True, debug=True)
DATABASE = MySQLDatabase.from_config(CONFIG['db'])


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

    try:
        customer = Customer.get(Customer.id == cid)
    except Customer.DoesNotExist:
        return ('No such customer: {}.'.format(cid), 404)

    real_estates = [r.to_dict(limit=True) for r in real_estates_of(customer)]
    return Response(dumps(real_estates), mimetype='application/json')


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


class ImmoBrowseModel(Model):
    """Basic ORM model for ImmoBrowse."""

    class Meta:
        database = DATABASE

    id = PrimaryKeyField()


class Override(ImmoBrowseModel):
    """Customer overrides for ImmoBrowse."""

    customer = ForeignKeyField(Customer, column_name='customer')
