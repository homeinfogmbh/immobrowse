"""ImmoBrowse real estate backend."""

from configparser import ConfigParser
from json import dumps

from flask import make_response, jsonify, Flask
from peewee import DoesNotExist, Model, PrimaryKeyField, ForeignKeyField

from homeinfo.crm import Customer
from mimeutil import mimetype
from peeweeplus import MySQLDatabase

from openimmodb import Immobilie, Anhang

__all__ = ['APPLICATION']

PORTALS = ('immobrowse', 'homepage', 'website')
CONFIG = ConfigParser()
CONFIG.read('/etc/immobrowse.conf')
APPLICATION = Flask('immobrowse')


def real_estates_of(customer):
    """Yields real estates of the respective customer."""

    for immobilie in Immobilie.by_customer(customer):
        if immobilie.active and approve(immobilie, PORTALS):
            yield immobilie


def approve(immobilie, portals):
    """Chekcs whether the real estate is in any of the portals."""

    try:
        Override.get(Override.customer == immobilie.customer)
    except DoesNotExist:
        return any(immobilie.approve(portal) for portal in portals)

    return True


@APPLICATION.route('/list/<int:cid>')
def get_list(cid):
    """Returns the respective real estate list."""

    try:
        customer = Customer.get(Customer.id == cid)
    except DoesNotExist:
        return ('No such customer: {}'.format(cid), 404)

    realestates = [r.to_dict(limit=True) for r in real_estates_of(customer)]
    print(dumps(realestates, indent=2), flush=True)
    #return jsonify([r.to_dict(limit=True) for r in real_estates_of(customer)])
    return jsonify(realestates)


@APPLICATION.route('/expose/<int:ident>')
def get_expose(ident):
    """Returns the respective detail expose."""

    try:
        immobilie = Immobilie.get(Immobilie.id == ident)
    except DoesNotExist:
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
    except DoesNotExist:
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
        database = MySQLDatabase(
            CONFIG['db']['database'],
            host=CONFIG['db']['host'],
            user=CONFIG['db']['user'],
            passwd=CONFIG['db']['passwd'],
            closing=True)

    id = PrimaryKeyField()


class Override(ImmoBrowseModel):
    """Customer overrides for ImmoBrowse."""

    customer = ForeignKeyField(Customer, db_column='customer')
