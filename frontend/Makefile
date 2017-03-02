.PHONY: pull push install

default: | pull install

install:
	@ /bin/cp -auv * /srv/http/de/homeinfo/testing/immobrowse/

pull:
	@ git pull

push:
	@ git push
