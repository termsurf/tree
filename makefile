
make:
	cd tool && vsce package
.PHONY: make

host:
	cd tool && vsce publish
.PHONY: host
