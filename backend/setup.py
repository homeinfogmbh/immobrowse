#! /usr/bin/env python3
"""Install script."""

from setuptools import setup

setup(
    name='immobrowse',
    use_scm_version={
        "root": "..",
        "relative_to": __file__,
        "local_scheme": "node-and-timestamp"
    },
    setup_requires=['setuptools_scm'],
    author='HOMEINFO - Digitale Informationssysteme GmbH',
    author_email='<info at homeinfo dot de>',
    maintainer='Richard Neumann',
    maintainer_email='<r dot neumann at homeinfo period de>',
    install_requires=[
        'configlib',
        'flask',
        'mdb',
        'openimmo',
        'openimmodb',
        'peewee',
        'peeweeplus',
        'setuptools',
        'wsgilib'
    ],
    packages=['immobrowse'],
    description='Real estate search engine.'
)
