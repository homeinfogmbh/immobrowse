.PHONY: pull push install

default: | pull install

install:
	@ /bin/cp -auv * /srv/http/de/homeinfo/testing/immobrowse/
	@ /bin/cp -auv immobrowse.js /srv/http/de/homeinfo/javascript/

pull:
	@ git pull

push:
	@ git push
