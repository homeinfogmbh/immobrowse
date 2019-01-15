"""ImmoBrowse real estate backend.

This web service is part of ImmoBrowse.
"""

from flask import request

from openimmodb import Immobilie, Anhang, BarrierFreeness
from wsgilib import Application, Binary, JSON


__all__ = ['APPLICATION']


PORTALS = {
    'hannover': ('barrierefrei-wohnen-hannover', 'hba'),
    'bremen': (
        'barrierefrei-wohnen-bremen',
        'barrierefrei-wohnen-bremerhaven',
        'breba')}
APPLICATION = Application('barrierfree', cors=True, debug=True)


def approve(immobilie, portals):
    """Chekcs whether the real estate is in any of the portals."""

    return any(immobilie.approve(portal) for portal in portals)


def barrierfree(immobilie):
    """Checks whether the real estate is barrier free."""

    try:
        barrier_freeness = immobilie.barrier_freeness
    except BarrierFreeness.DoesNotExist:
        return False

    return barrier_freeness.complete or barrier_freeness.limited


def list_(portals):
    """Yields barrierfree real estates for the respective portal."""

    for immobilie in Immobilie:
        if approve(immobilie, portals) and barrierfree(immobilie):
            yield immobilie


@APPLICATION.route('/list')
def get_list():
    """Returns the list of barrier-free real estates."""

    portal = request.args['portal']

    try:
        portals = PORTALS[portal]
    except KeyError:
        return ('Unknown portal.', 400)

    real_estates = [
        real_estate.to_dict(limit=True) for real_estate in list_(portals)]
    return JSON(real_estates)


@APPLICATION.route('/expose/<int:ident>')
def get_expose(ident):
    """Returns the respective expose."""

    portal = request.args['portal']

    try:
        portals = PORTALS[portal]
    except KeyError:
        return ('Unknown portal.', 400)

    try:
        immobilie = Immobilie.get(Immobilie.id == ident)
    except Immobilie.DoesNotExist:
        return ('No such real estate: {}.'.format(ident), 404)

    if barrierfree(immobilie):
        if approve(immobilie, portals):
            if immobilie.active:
                return JSON(immobilie.to_dict(limit=True))

            return ('Real estate is not active.', 404)

        return ('Real estate not cleared for portal.', 403)

    return ('Real estate is not barrier free.', 404)


@APPLICATION.route('/attachment/<int:ident>')
def get_attachment(ident):
    """Returns the respective attachment."""

    portal = request.args['portal']

    try:
        portals = PORTALS[portal]
    except KeyError:
        return ('Unknown portal.', 400)

    try:
        attachment = Anhang.get(Anhang.id == ident)
    except Anhang.DoesNotExist:
        return ('No such attachment: {}.'.format(ident), 404)

    if approve(attachment.immobilie, portals):
        return Binary(attachment.data)

    return ('Related real estate not cleared for portal.', 403)
