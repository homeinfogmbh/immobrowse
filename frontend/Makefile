.PHONY: pull install

default: | pull install

install:
	@ install -vm 644 config.js immobrowse.css expose.* gallery.* list.* /srv/http/de/homeinfo/testing/immobrowse/
	@ install -dm 755 /srv/http/de/homeinfo/testing/immobrowse/img
	@ install -vm 644 img/* /srv/http/de/homeinfo/testing/immobrowse/img/

pull:
	@ git pull
