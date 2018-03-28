#! /usr/bin/env python3

from distutils.core import setup

setup(
    name='immobrowse',
    requires=['openimmodb'],
    py_modules=['immobrowse', 'barrierfree', 'realestates'],
    description='Real estate search engine.')
