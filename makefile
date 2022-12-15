
build:
	cd code && vsce package
.PHONY: build

publish:
	cd code && vsce publish
.PHONY: publish
