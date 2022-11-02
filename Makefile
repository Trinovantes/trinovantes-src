print-%: ; @echo $*=$($*)

-include .env
export

export GIT_HASH                 := $(shell git rev-parse HEAD)
export DOCKER_BUILDKIT          := 1
export COMPOSE_DOCKER_CLI_BUILD := 1

dockerfile = ./docker/web.Dockerfile
container = trinovantes-web
image = ghcr.io/trinovantes/$(container)

.PHONY: build stop run all pull push clean

all: build run

# -----------------------------------------------------------------------------
# Commands
# -----------------------------------------------------------------------------

build:
	docker build \
		--file $(dockerfile) \
		--tag $(image) \
		--progress=plain \
		--secret id=GIT_HASH \
		--secret id=GITHUB_PAT \
		--secret id=AWS_ENDPOINT_URL \
		--secret id=AWS_ACCESS_KEY_ID \
		--secret id=AWS_SECRET_ACCESS_KEY \
		.

stop:
	docker stop $(container) || true
	docker rm $(container) || true

run: stop
	docker run \
		--publish 9000:80 \
		--network nginx-network \
		--log-driver local \
		--restart=always \
		--detach \
		--name $(container) \
		$(image)

# -----------------------------------------------------------------------------
# Maintenance
# -----------------------------------------------------------------------------

pull:
	docker pull $(image) --quiet

push:
	docker push $(image) --quiet

clean:
	rm -rf ./dist
	docker container prune -f
	docker image prune -f
