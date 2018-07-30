"""ImmoBrowse's configuration."""

from configparser import ConfigParser


__all__ = ['CONFIG']


CONFIG = ConfigParser()
CONFIG.read('/etc/immobrowse.conf')
