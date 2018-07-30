#! /usr/bin/env python3

from distutils.core import setup

setup(
    name='immobrowse',
    author='HOMEINFO - Digitale Informationssysteme GmbH',
    author_email='info@homeinfo.de',
    maintainer='Richard Neumann',
    maintainer_email='r.neumann@homeinfo.de',
    requires=['openimmodb'],
    packages=['immobrowse'],
    description='Real estate search engine.')
