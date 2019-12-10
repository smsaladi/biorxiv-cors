#!/usr/bin/env node

var express = require('express');
var request = require('request');
var cors = require('cors');
const helmet = require('helmet');

const commandLineArgs = require('command-line-args');


// Edited from https://github.com/garmeeh/local-cors-proxy
// Commit a80eb41, MIT license
var startProxy = function(app, port, proxyUrl, proxyPartial) {
  app.use(cors());
  app.options('*', cors());

  // remove trailing slash
  var cleanProxyUrl = proxyUrl.replace(/\/$/, '');
  // remove all forward slashes
  var cleanProxyPartial = proxyPartial.replace(/\//g, '');

  app.use('/' + cleanProxyPartial, function(req, res) {
    try {
      console.log(chalk.green('Request Proxied -> ' + req.url));
    } catch (e) {}
    req.pipe(request(cleanProxyUrl + req.url)).pipe(res);
  });

  app.listen(port);

  console.log('Proxy Active on port ' + port);
  return app;
};


var optionDefinitions = [
  { name: 'port', alias: 'p', type: Number, defaultValue: 8010 },
  { name: 'proxyUrl', type: String, defaultValue: "https://www.biorxiv.org" },
  {
    name: 'proxyPartial',
    type: String,
    defaultValue: ''
  }
];
var options = commandLineArgs(optionDefinitions);

var app = express();
app.use(helmet());

startProxy(app, options.port, options.proxyUrl, options.proxyPartial);
