#! /usr/bin/env python3
"""ImmoBrowse WSGI application."""

from wsgilib import RestApp
from immobrowse import ROUTER

application = RestApp(ROUTER, cors=True, debug=True)
