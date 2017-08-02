.PHONY: backend frontend frontend-barrierfree frontend-immobit joomla library

default:
	@ echo "No default target to make"

backend:
	@ make -C backend

frontend:
	@ make -C frontend

frontend-barrierfree:
	@ make -C frontend-barrierfree

frontend-immobit:
	@ make -C frontend-immobit

joomla:
	@ rm -f joomla/immobrowse.zip; cd joomla/component; zip -r ../immobrowse.zip *

library:
	@ install -vm 644 immobrowse.js barrierfree.js /srv/http/de/homeinfo/javascript/
