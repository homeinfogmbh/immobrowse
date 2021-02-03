#! /usr/bin/env python3
"""Install script."""

from setuptools import setup

setup(
    name='immobrowse',
    use_scm_version={
        "local_scheme": "node-and-timestamp"
    },
    setup_requires=['setuptools_scm'],
    author='HOMEINFO - Digitale Informationssysteme GmbH',
    author_email='<info at homeinfo dot de>',
    maintainer='Richard Neumann',
    maintainer_email='<r dot neumann at homeinfo period de>',
    requires=['openimmodb'],
    packages=['immobrowse'],
    description='Real estate search engine.'
)
