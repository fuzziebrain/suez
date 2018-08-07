const
  express = require('express'),
  proxy = require('http-proxy-middleware');

var app = express();

var config = require('./config/settings.json');

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});

// *** Docker specific settings ***
// If run like "node app.js docker" then it will trigger the app to be run in docker mode
// config.docker = process.argv[2] == undefined ? false : true;
// console.log(`process.env.DOCKER: ${process.env.DOCKER}`);
config.docker = process.env.DOCKER == undefined ? false : true;
console.log(`config.docker: ${config.docker}`);
// If in docker mode then need to allow listen from all IPs (not just localhost)
config.listenHost = config.docker ? '' : '127.0.0.1';
console.log(`config.listenHost: ${config.listenHost}`);

// Docker relies on port 3000 (exposed port)
config.service.port = config.docker ? 3000 : config.service.port;
console.log(`config.service.port: ${config.service.port}`);

app.use('/', proxy(
  {
    target: 'http://localhost/',
    changeOrigin: true,
    router: function(req) {
      var routeName = req.hostname.split('.')[0];

      var proxyTarget = config.apiTargets.find(
        function(apiTarget) {
          return apiTarget.name == this;
        },
        routeName
      ).proxyTarget;

      return proxyTarget;
    }
  }
));

app.listen(config.service.port, config.listenHost);
