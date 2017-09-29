#! /usr/bin/env python3
"""ImmoBrowse barrier free WSGI application."""

from wsgilib import RestApp
from barrierfree import HANDLERS

application = RestApp({'barrierfree': HANDLERS}, cors=True, debug=True)
