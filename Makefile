SHELL := /bin/bash

add:
	git add .

commit:
	git commit -am "🍻 Updated `date`"

push:
	git push

build:
	yarn build

dev:
	yarn dev
