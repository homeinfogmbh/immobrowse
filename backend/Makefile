FILE_LIST = ./.installed_files.txt

.PHONY: pull push clean install post-intall uninstall

default: | pull clean install post-intall

install:
	@ ./setup.py install --record $(FILE_LIST)

post-intall:
	@ fixuwsgi immobrowse barrierfree

uninstall:
	@ while read FILE; do echo "Removing: $$FILE"; rm "$$FILE"; done < $(FILE_LIST)

clean:
	@ rm -Rf ./build

pull:
	@ git pull

push:
	@ git push
