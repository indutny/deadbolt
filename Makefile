build:
	node-waf build

docs:
	docco-husky lib/deadbolt/*.js lib/deadbolt/storage/*.js

clean:
	node-waf clean

.PHONY: build docs clean test
