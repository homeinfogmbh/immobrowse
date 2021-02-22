.PHONY: backend frontend frontend-barrierfree frontend-immobit library

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

library:
	@ install -dm 755 /srv/http/de/homeinfo/javascript/immobrowse
	@ install -dm 644 -t /srv/http/de/homeinfo/javascript/immobrowse/ library/*.mjs
