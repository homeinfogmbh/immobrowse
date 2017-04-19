#! /usr/bin/env python3
"""ImmoBrowse WSGI application"""

from wsgilib import RestApp
from immobrowse import HANDLERS

application = RestApp({'immobrowse': HANDLERS}, cors=True, debug=True)
