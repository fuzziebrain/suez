<!-- TOC -->

- [Introduction](#introduction)
- [Software Requirements](#software-requirements)
- [Installation and Deployment](#installation-and-deployment)
  - [Deployment](#deployment)
- [Configuration](#configuration)
- [Usage](#usage)
- [Known Issues](#known-issues)
- [Docker Support](#docker-support)
  - [Get Docker image](#get-docker-image)
  - [Run Container](#run-container)
  - [Container Parameters](#container-parameters)

<!-- /TOC -->

# Introduction
Suez is a simple [Nodejs](https://nodejs.org/) application for proxying to web resources such as RESTful web services. While accessing web resources over a secure transport layer is strongly encouraged, certain software and budget limitations may prohibit us from adopting security best practices.

Suez was written specifically as a workaround for [Oracle Application Express](https://apex.oracle.com/) developers who use and deploy applications to an [Oracle Database Express Edition](http://www.oracle.com/technetwork/database/database-technologies/express-edition/) database. The database software is provided free by Oracle and hence, lacks continued software support/upgrades and tools for managing the Oracle Wallet and SSL certificates.

To circumvent this limitation, Suez acts as a bridge between secured web services and an APEX application.

# Software Requirements

* Node.js(r) - should run on both LTS and non-LTS versions

# Installation and Deployment

_Note see [Docker Support](#docker-support) if you want to use SUEZ's docker container instead._

*The following instructions are based on a CentOS 7 environment as recommended in the [OXAR](https://github.com/OraOpenSource/OXAR) project. Please adapt based on the operating system available to you.*

1. In the destination directory, e.g. `/opt`, clone the project.
```bash
$ git clone https://github.com/fuzziebrain/suez.git
```

2. Make a copy of the sample configuration file and adapt as needed. Please see
the configuration section for details.

3. Run the application:
```bash
$ node /opt/suez/app.js
```

## Deployment

Using [PM2](http://pm2.keymetrics.io/) to run Suez as a service is encouraged. Please see the [quick start](http://pm2.keymetrics.io/docs/usage/quick-start/) guide for more information.

# Configuration
A sample configuration file is [provided](../master/config/settings.json.sample) and shown below:

```json
{
  "service": {
    "port": 3000
  },
  "apiTargets": [
    {
      "name": "typicode",
      "proxyTarget": "https://jsonplaceholder.typicode.com/"
    },
    {
      "name": "acmeapi",
      "proxyTarget": "https://api.acme.com/"
    }
  ]
}
```


In the example, Suez is configured to listen to port `3000` and will provide access to two different API targets: `typicode` and `acmeapi`.

To configure Suez, make a copy of this file, change the service port number, if necessary, and then add `apiTargets` as required. Save this file and name it `settings.json`.

# Usage
The following example is based on the sample settings file provided. _Note: https://jsonplaceholder.typicode.com/ is a demo site for developers to test their RESTful API calls._

Suppose the developer would like to access the users via typicode's API. The URI provided by the vendor is `https://jsonplaceholder.typicode.com/users`. The corresponding PL/SQL code use to interact with service would look something like this:

```plsql
l_response := apex_web_service.make_rest_request(
  p_url => 'http://typicode.localhost:3000/users'
  , p_http_method => 'GET'
);
```

# Known Issues
1. If the subdomain of `localhost` is unresolvable, add it to the hosts file, for example:

```bash
# For Linux: /etc/hosts
# For Windows: %SystemRoot%\System32\drivers\etc\hosts
127.0.0.1   localhost contosoapi.localhost acmeapi.localhost
```

# Docker Support

If you don't want to install anything you can use the [SUEZ docker image](https://hub.docker.com/r/fuzziebrain/suez/).

## Get Docker image

`docker pull fuzziebrain/suez`

## Run Container

```bash
# Note my settings.json is stored in ~/docker/suez
docker run -it -d \
  --name=suez \
  -v ~/docker/suez:/app/suez/config \
  -p 8888:3000 \
  fuzziebrain/suez:latest

# Stopping immediately using the -t 1
docker stop -t 1 suez

docker start suez
```

## Container Parameters

Parameter | Description
--- | ---
`-e WATCH=true` | Optional: setting this to `WATCH=true` will restart the node service each time `settings.json` is changed. This is recommended for active development environments
`--name` | Optional: Name to label container
`-v <local dir>:/app/suez/config` | Location where `settings.json` is stored
`-p 8888:3000`  | Suez uses port 3000 internally and this must be used, map it accordingly to your system. In this case port 8888 will be mapped to the container's port 3000.
