build:
	node-waf build

docs: lib/deadbolt/core.js lib/deadbolt/wrap.js
	docco lib/deadbolt/core.js lib/deadbolt/wrap.js

clean:
	node-waf clean

.PHONY: build clean test
