#! /usr/bin/env python3
"""ImmoBrowse WSGI application"""

from homeinfo.lib.rest import RestApp
from immobrowse import ImmoBrowse


application = RestApp({'immobrowse': ImmoBrowse, cors=True})
