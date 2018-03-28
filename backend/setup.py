#! /usr/bin/env python3

from distutils.core import setup

setup(
    name='immobrowse',
    requires=['openimmodb'],
    py_modules=['immobrowse', 'barrierfree', 'realestates'],
    data_files=[
        ('/usr/lib/systemd/system', [
            'immobrowse.service', 'barrierfree.service'])],
    description='Real estate search engine')
