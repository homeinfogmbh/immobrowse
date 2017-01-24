#! /usr/bin/env python3
"""ImmoBrowse WSGI application"""

from homeinfo.lib.rest import RestApp
from immobrowse import HANDLERS

application = RestApp(HANDLERS, cors=True, debug=True)
