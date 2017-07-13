#! /usr/bin/env python3

from distutils.core import setup

setup(
    name='immobrowse',
    version='1.0.0',
    requires=['openimmodb'],
    py_modules=['immobrowse', 'barrierfree'],
    data_files=[
        ('/usr/share', ['immobrowse.wsgi', 'barrierfree.wsgi']),
        ('/etc/uwsgi/apps-available', ['immobrowse.ini', 'barrierfree.ini'])],
    description='Real estate search engine')
