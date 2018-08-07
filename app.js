const
  express = require('express'),
  proxy = require('http-proxy-middleware');

var app = express();

var config = require('./config/settings.json');

app.use('/', proxy(
  {
    target: 'http://localhost/',
    changeOrigin: true,
    router: function(req) {
      var routeName = req.hostname.split('.')[0];
      console.log(`routeName: ${routeName}`);

      var proxyTarget = config.apiTargets.find(
        function(apiTarget) {
          return apiTarget.name == this;
        },
        routeName
      ).proxyTarget;

      console.log(`${proxyTarget}`);

      return proxyTarget;
    }
  }
));

app.listen(config.service.port, '127.0.0.1');
