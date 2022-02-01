"""ImmoBrowse real estate backend.

This web service is part of ImmoBrowse.
"""
from typing import Iterator, Optional, Union

from mdb import Customer
from openimmodb import Immobilie, Anhang
from wsgilib import Application, Binary, JSON, JSONMessage

from immobrowse.orm import Override


__all__ = ['APPLICATION']


PORTALS = ('immobrowse', 'homepage', 'website')
APPLICATION = Application('immobrowse', debug=True, cors=True)


def has_override(customer: Union[Customer, int]) -> bool:
    """Checks if the customer has an override."""

    try:
        Override.get(Override.customer == customer)
    except Override.DoesNotExist:
        return False

    return True


def approve(immobilie: Immobilie, override: Optional[bool] = None) -> bool:
    """Checks whether the real estate is in any of the portals."""

    if override:
        return True

    if override is None and has_override(immobilie.customer):
        return True

    return any(immobilie.approve(portal) for portal in PORTALS)


def real_estates_of(customer: Union[Customer, int]) -> Iterator[Immobilie]:
    """Yields real estates of the respective customer."""

    override = has_override(customer)

    for immobilie in Immobilie.by_customer(customer):
        if immobilie.active and approve(immobilie, override=override):
            yield immobilie


@APPLICATION.route('/list/<int:ident>')
def get_list(ident: int) -> Union[JSON, JSONMessage]:
    """Returns the respective real estate list."""

    try:
        customer = Customer.get(Customer.id == ident)
    except Customer.DoesNotExist:
        return JSONMessage('No such customer.', status=404)

    return JSON([re.to_json(limit=True) for re in real_estates_of(customer)])


@APPLICATION.route('/expose/<int:ident>')
def get_expose(ident: int) -> Union[JSON, JSONMessage]:
    """Returns the respective detail expose."""

    try:
        immobilie = Immobilie.get(Immobilie.id == ident)
    except Immobilie.DoesNotExist:
        return JSONMessage('No such real estate.', status=404)

    if approve(immobilie) and immobilie.active:
        return JSON(immobilie.to_json(limit=True))

    return JSONMessage('No such real estate.', status=404)


@APPLICATION.route('/attachment/<int:ident>')
def get_attachment(ident: int) -> Union[JSON, JSONMessage]:
    """Returns the respective attachment."""

    try:
        anhang = Anhang.get(Anhang.id == ident)
    except Anhang.DoesNotExist:
        return JSONMessage('No such attachment.', status=404)

    if approve(anhang.immobilie):
        return Binary(anhang.bytes)

    return JSONMessage('No such attachment.', status=404)
