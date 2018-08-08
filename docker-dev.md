<!-- TOC -->

- [SUEZ Docker Development](#suez-docker-development)
  - [Preconfig](#preconfig)
  - [Run with normal config volume](#run-with-normal-config-volume)
  - [Run using local directory as source](#run-using-local-directory-as-source)

<!-- /TOC -->

# SUEZ Docker Development

This documentation is used to help when working on the `Dockerfile`

## Preconfig

```bash
SUEZ_ROOT=~/Documents/GitHub/martindsouza/suez

```
## Run with normal config volume

```bash
# Run and destroy
docker run -it --rm \
  -v $SUEZ_ROOT/config:/app/suez/config \
  -p 3000:3000 \
  suez:latest

# Watch option
docker run -it --rm \
  -v $SUEZ_ROOT/config:/app/suez/config \
  -e WATCH=true \
  -p 3000:3000 \
  suez:latest
```

## Run using local directory as source

_Note: need to change the `Dockerfile` to expose appropriate volume_

```bash
docker run -it --rm \
  -v $SUEZ_ROOT/:/app/suez \
  -p 3000:3000 \
  suez:latest
```