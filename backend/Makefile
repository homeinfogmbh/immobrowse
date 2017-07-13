FILE_LIST = ./.installed_files.txt

.PHONY: pull push clean check install post-intall uninstall

default: | pull clean check install post-intall

install:
	@ ./setup.py install --record $(FILE_LIST)

post-intall:
	@ fixuwsgi immobrowse

uninstall:
	@ while read FILE; do echo "Removing: $$FILE"; rm "$$FILE"; done < $(FILE_LIST)

clean:
	@ rm -Rf ./build

check:
	@ find . -type f -name "*.py" -not -path "./build/*" -exec pep8 --hang-closing {} \;

pull:
	@ git pull

push:
	@ git push
