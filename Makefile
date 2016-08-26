
all:
	node src/index.js

test:
	istanbul cover _mocha -- -R spec && npm run-script flow && semistandard --fix

.PHONY: test
