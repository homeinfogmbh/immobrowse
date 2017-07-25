.PHONY: pull install

default: | pull install

install:
	@ install -vm 644 config.js immobrowse.css expose.* gallery.* list.* /srv/http/de/homeinfo/testing/immobrowse-barrierfree/
	@ install -dm 755 /srv/http/de/homeinfo/testing/immobrowse-barrierfree/img
	@ install -vm 644 img/* /srv/http/de/homeinfo/testing/immobrowse-barrierfree/img/

pull:
	@ git pull
