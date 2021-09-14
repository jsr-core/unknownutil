TOOLS := ${CURDIR}/.tools
TARGETS := $$(find . \( -name '*.ts' -or -name '*.md' \) -not -path './.node/*' -not -path './node_modules/*')

.DEFAULT_GOAL := help

help:
	@cat $(MAKEFILE_LIST) | \
	    perl -ne 'print if /^\w+.*##/;' | \
	    perl -pe 's/(.*):.*##\s*/sprintf("%-20s",$$1)/eg;'

tools: FORCE	## Install development tools
	@mkdir -p ${TOOLS}
	@deno install -A -f -n udd --root ${TOOLS} https://deno.land/x/udd@0.5.0/main.ts

fmt: FORCE	## Format code
	@deno fmt ${TARGETS}

fmt-check: FORCE	## Format check
	@deno fmt --check ${TARGETS}

lint: FORCE	## Lint code
	@deno lint ${TARGETS}

type-check: FORCE	## Type check
	@deno test --unstable --no-run ${TARGETS}

test: FORCE	## Test
	@deno test --unstable -A ${TARGETS}

update: FORCE	## Update dependencies
	@${TOOLS}/bin/udd ${TARGETS}
	@make fmt

FORCE:
