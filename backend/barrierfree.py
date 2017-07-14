"""ImmoBrowse real estate backend"""

from peewee import DoesNotExist
from wsgilib import Error, JSON, Binary, ResourceHandler

from openimmodb import Immobilie, Anhang
from immobrowse import customer

__all__ = ['HANDLERS']

PORTALS = {
    'hannover': ('barrierefrei-wohnen-hannover', 'hba'),
    'bremen': (
        'barrierefrei-wohnen-bremen',
        'barrierefrei-wohnen-bremerhaven',
        'breba')}


def approve(immobilie, portals):
    """Chekcs whether the real estate is in any of the portals"""

    return any(immobilie.approve(portal) for portal in portals)


def barrierfree(immobilie):
    """Checks whether the real estate is barrier free"""

    try:
        barrier_freeness = immobilie.barrier_freeness
    except DoesNotExist:
        return False
    else:
        return barrier_freeness.complete or barrier_freeness.limited


def list_(portals):
    """Yields barrierfree real estates for the respective portal"""

    for immobilie in Immobilie:
        if approve(immobilie, portals):
            if barrierfree(immobilie):
                yield immobilie


def expose(ident, portals):
    """Returns the reapective real estate for the customer"""

    if ident is None:
        raise Error('No real estate specified') from None
    else:
        try:
            immobilie = Immobilie.get(Immobilie.id == ident)
        except DoesNotExist:
            raise Error('No such real estate: {}'.format(ident),
                        status=404) from None
        else:
            if barrierfree(immobilie):
                if approve(immobilie, portals):
                    if immobilie.active:
                        return immobilie
                    else:
                        raise Error('Real estate is not active',
                                    status=403) from None
                else:
                    raise Error('Real estate not cleared for portal.',
                                status=403) from None
            else:
                raise Error('Real estate is not barrier free.',
                            status=403) from None


def attachment(ident, portals):
    """Returns the respective attachment"""

    try:
        attachment = Anhang.get(Anhang.id == ident)
    except DoesNotExist:
        raise Error('No such attachment: {}'.format(ident),
                    status=404) from None
    else:
        if approve(attachment.immobilie, portals):
            return attachment
        else:
            raise Error(
                'Related real estate not cleared for portal.') from None


class BarrierFreeHandler(ResourceHandler):
    """Common abstract handler base"""

    @property
    def portal(self):
        """Returns the desired portal"""
        try:
            return self.query['portal']
        except KeyError:
            raise Error('No portal specified.') from None

    @property
    def portals(self):
        """Returns the portal names for the desired portal"""
        try:
            return PORTALS[self.portal]
        except KeyError:
            raise Error('Unknown portal.') from None

    @property
    def customer(self):
        """Returns the appropriate customer"""
        return customer(self.query.get('customer'))


class ListHandler(BarrierFreeHandler):
    """Handles real estate list queries for customers"""

    def get(self):
        """Retrieves real estates"""
        return JSON([r.to_dict(limit=True) for r in list_(self.portals)])


class ExposeHandler(BarrierFreeHandler):
    """Handles real estate list queries for customers"""

    def get(self):
        """Retrieves real estates"""
        immobilie = expose(int(self.resource), self.portals)
        return JSON(immobilie.to_dict(limit=True))


class AttachmentHandler(BarrierFreeHandler):
    """Handles requests on attachments"""

    def get(self):
        """Returns the respective attachment"""
        try:
            ident = int(self.resource)
        except (TypeError, ValueError):
            raise Error('Invalid attachment id: {}.'.format(
                self.resource)) from None
        else:
            return Binary(attachment(ident).data)


HANDLERS = {
    'list': ListHandler,
    'expose': ExposeHandler,
    'attachment': AttachmentHandler}
