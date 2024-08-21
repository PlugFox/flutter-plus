SHELL :=/bin/bash -e -o pipefail
PWD   := $(shell pwd)

# constants
DOCKER_REPO := plugfox/chat
DOCKER_TAG  := latest

.DEFAULT_GOAL := all
.PHONY: all
all: ## build pipeline
all: mod inst gen build spell lint test

.PHONY: precommit
precommit: ## validate the branch before commit
precommit: all vuln

.PHONY: ci
ci: ## CI build pipeline
ci: lint-reports test govulncheck precommit diff

.PHONY: help
help:
	@echo 'Usage: make <OPTIONS> ... <TARGETS>'
	@echo ''
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: setup
setup: ## setup environment
	@npm install
	@npm install -g @vscode/vsce

.PHONY: login
login: ## login to vsce
	@vsce login plugfox

.PHONY: build
build: setup ## build extension
	@vsce package

.PHONY: publish
publish: build ## publish extension
	@vsce publish

.PHONY: minor
minor: build ## publish minor version
	@vsce publish minor

.PHONY: test
test: ## run tests
	@npm install
	@npm test

.PHONY: diff
diff: ## git diff
	$(call print-target)
	@git diff --exit-code
	@RES=$$(git status --porcelain) ; if [ -n "$$RES" ]; then echo $$RES && exit 1 ; fi

define print-target
    @printf "Executing target: \033[36m$@\033[0m\n"
endef