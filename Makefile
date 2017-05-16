.PHONY: backend library frontend joomla

default:
	@ echo "No default target to make"

backend:
	@ make -C backend

library:
	@ install -vm 644 immobrowse.js /srv/http/de/homeinfo/jslibs/immobrowse.js

frontend:
	@ make -C frontend

joomla:
	@ rm -f joomla/immobrowse.zip; cd joomla/component; zip -r ../immobrowse.zip *; cd ../..
