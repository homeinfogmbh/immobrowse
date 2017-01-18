#! /usr/bin/env python3

from distutils.core import setup

setup(name='immobrowse',
      version='1.0.0',
      requires=['openimmo', 'homeinfo.crm'],
      py_modules=['immobrowse'],
      data_files=[
          ('/usr/share', ['immobrowse.wsgi']),
          ('/etc/uwsgi/apps-available', ['immobrowse.ini'])],
      license=open('LICENSE.txt').read(),
      description='Real estate search engine',
      long_description=open('README.txt').read())
