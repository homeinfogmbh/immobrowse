#! /usr/bin/env python3

from distutils.core import setup

setup(
    name='immobrowse',
    version='2.0.0',
    requires=['openimmodb'],
    py_modules=['immobrowse', 'barrierfree'],
    scripts=['immobrowsed', 'barrierfreed'],
    data_files=[
        ('/usr/lib/systemd/system', [
            'immobrowse.service', 'barrierfree.service'])],
    description='Real estate search engine')
