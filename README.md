# Suez
## Introduction
Suez is a simple [Nodejs](https://nodejs.org/) application for proxying to web
resources such as RESTful web services. While accessing web resources over a
secure transport layer is strongly encouraged, certain software and budget
limitations may prohibit us from adopting security best practices.

Suez was written specifically as a workaround for [Oracle Application Express](https://apex.oracle.com/)
developers who use and deploy applications to an
[Oracle Database Express Edition](http://www.oracle.com/technetwork/database/database-technologies/express-edition/)
database. The database software is provided free by Oracle and hence, lacks
continued software support/upgrades and tools for managing the Oracle Wallet and
SSL certificates.

To circumvent this limitation, Suez acts as a bridge between secured web
services and an APEX application.

## Software Requirements
* Node.js(r) - should run on both LTS and non-LTS versions

## Installation and Deployment
*The following instructions are based on a CentOS 7 environment as recommended
in the [OXAR](https://github.com/OraOpenSource/OXAR) project. Please adapt based
on the operating system available to you.*
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

### Deployment
Using [PM2](http://pm2.keymetrics.io/) to run Suez as a service is encouraged.
Please see the [quick start](http://pm2.keymetrics.io/docs/usage/quick-start/)
guide for more information.

## Configuration
A sample configuration file is [provided](../master/config/settings.json.sample)
and shown below:
```json
{
  "service": {
    "port": 3000
  },
  "apiTargets": [
    {
      "name": "contosoapi",
      "proxyTarget": "https://api.contoso.com/"
    },
    {
      "name": "acmeapi",
      "proxyTarget": "https://api.acme.com/"
    }
  ]
}
```

In the example, Suez is configured to listen to port `3000` and will provide
access to two different API targets: `contosoapi` and `acmeapi`.

To configure Suez, make a copy of this file, change the service port number, if
necessary, and then add `apiTargets` as required. Save this file and name it
`settings.json`.

## Usage
The following example is based on the sample settings file provided.

Suppose the developer would like to access the stock list through the Contoso
API. The URI provided by the vendor is `https://api.contoso.com/v1/stock/list`.
The corresponding PL/SQL code use to interact with service would look something
like this:
```plsql
l_response := apex_web_service.make_rest_request(
  p_url => 'http://contosoapi.localhost/v1/stock/list'
  , p_http_method => 'GET'
  , p_parm_name => apex_util.string_to_table('token:count')
  , p_parm_value =>
      apex_util.string_to_table(
        p_contoso_token || ':' || p_count
      )
);
```

## Known Issues
1. If the subdomain of `localhost` is unresolvable, add it to the hosts file,
for example:
```bash
# For Linux: /etc/hosts
# For Windows: %SystemRoot%\System32\drivers\etc\hosts
127.0.0.1   localhost contosoapi.localhost acmeapi.localhost
```