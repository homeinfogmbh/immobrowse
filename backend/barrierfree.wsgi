#! /usr/bin/env python3
"""ImmoBrowse barrier free WSGI application."""

from wsgilib import RestApp
from barrierfree import ROUTER

application = RestApp(ROUTER, cors=True, debug=True)
