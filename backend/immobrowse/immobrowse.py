"""ImmoBrowse real estate backend.

This web service is part of ImmoBrowse.
"""
from filedb import FileError
from mdb import Customer
from openimmodb import Immobilie, Anhang
from wsgilib import Application, Binary, JSON

from immobrowse.orm import Override


__all__ = ['APPLICATION']


PORTALS = ('immobrowse', 'homepage', 'website')
APPLICATION = Application('immobrowse', cors=True, debug=True)


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

    try:
        customer = Customer.get(Customer.id == cid)
    except Customer.DoesNotExist:
        return (f'No such customer: {cid}.', 404)

    real_estates = [
        real_estate.to_dict(limit=True) for real_estate
        in real_estates_of(customer)]
    return JSON(real_estates)


@APPLICATION.route('/expose/<int:ident>')
def get_expose(ident):
    """Returns the respective detail expose."""

    try:
        immobilie = Immobilie.get(Immobilie.id == ident)
    except Immobilie.DoesNotExist:
        return (f'No such real estate: {ident}.', 404)

    if approve(immobilie):
        if immobilie.active:
            return JSON(immobilie.to_dict(limit=True))

        return ('Real estate is not active.', 404)

    return ('Real estate not cleared for portal.', 403)


@APPLICATION.route('/attachment/<int:ident>')
def get_attachment(ident):
    """Returns the respective attachment."""

    try:
        anhang = Anhang.get(Anhang.id == ident)
    except Anhang.DoesNotExist:
        return (f'No such attachment: {ident}', 404)

    if approve(anhang.immobilie):
        try:
            return Binary(anhang.data)
        except FileError:
            return ('Attachment is orphaned.', 500)

    return ('Related real estate not cleared for portal.', 403)
