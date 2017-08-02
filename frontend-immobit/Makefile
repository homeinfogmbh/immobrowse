.PHONY: pull install

default: | pull install

install:
	@ install -dm 755 /srv/http/de/immobit/preview
	@ install -vm 644 config.js immobrowse.css expose.* gallery.* /srv/http/de/immobit/preview/
	@ install -dm 755 /srv/http/de/immobit/preview/img
	@ install -vm 644 img/* /srv/http/de/immobit/preview/img/

pull:
	@ git pull
