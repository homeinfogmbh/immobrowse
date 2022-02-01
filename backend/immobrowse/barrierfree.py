"""ImmoBrowse real estate backend.

This web service is part of ImmoBrowse.
"""
from typing import Iterable, Iterator, Union

from flask import request

from openimmodb import Immobilie, Anhang, BarrierFreeness
from wsgilib import Application, Binary, JSON, JSONMessage


__all__ = ['APPLICATION']


PORTALS = {
    'hannover': ('barrierefrei-wohnen-hannover', 'hba'),
    'bremen': (
        'barrierefrei-wohnen-bremen',
        'barrierefrei-wohnen-bremerhaven',
        'breba'
    )
}
APPLICATION = Application('barrierfree', debug=True, cors=True)


def approve(immobilie: Immobilie, portals: Iterable[str]) -> bool:
    """Chekcs whether the real estate is in any of the portals."""

    return any(immobilie.approve_explicit(portal) for portal in portals)


def barrierfree(immobilie: Immobilie) -> bool:
    """Checks whether the real estate is barrier free."""

    try:
        barrier_freeness = immobilie.barrier_freeness.get()
    except BarrierFreeness.DoesNotExist:
        return False

    return barrier_freeness.complete or barrier_freeness.limited


def list_(portals: Iterable[str]) -> Iterator[Immobilie]:
    """Yields barrierfree real estates for the respective portal."""

    for immobilie in Immobilie:
        if approve(immobilie, portals) and barrierfree(immobilie):
            yield immobilie


@APPLICATION.route('/list')
def get_list() -> Union[JSON, JSONMessage]:
    """Returns the list of barrier-free real estates."""

    portal = request.args['portal']

    try:
        portals = PORTALS[portal]
    except KeyError:
        return JSONMessage('Unknown portal.', status=400)

    return JSON([re.to_json(limit=True) for re in list_(portals)])


@APPLICATION.route('/expose/<int:ident>')
def get_expose(ident: int) -> Union[JSON, JSONMessage]:
    """Returns the respective expose."""

    portal = request.args['portal']

    try:
        portals = PORTALS[portal]
    except KeyError:
        return JSONMessage('Unknown portal.', status=400)

    try:
        immobilie = Immobilie.get(Immobilie.id == ident)
    except Immobilie.DoesNotExist:
        return JSONMessage('No such real estate.', status=404)

    if all(barrierfree(immobilie), approve(immobilie, portals),
           immobilie.active):
        return JSON(immobilie.to_json(limit=True))

    return JSONMessage('No such real estate.', status=404)


@APPLICATION.route('/attachment/<int:ident>')
def get_attachment(ident: int) -> Union[Binary, JSONMessage]:
    """Returns the respective attachment."""

    portal = request.args['portal']

    try:
        portals = PORTALS[portal]
    except KeyError:
        return JSONMessage('Unknown portal.', status=400)

    try:
        attachment = Anhang.get(Anhang.id == ident)
    except Anhang.DoesNotExist:
        return JSONMessage('No such attachment.', status=404)

    if approve(attachment.immobilie, portals):
        return Binary(attachment.bytes)

    return JSONMessage('No such attachment.', status=404)
