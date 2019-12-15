var express = require('express');
var path = require('path');
var request = require('request');
var cors = require('cors');
const helmet = require('helmet');

const commandLineArgs = require('command-line-args');


var optionDefinitions = [
  { name: 'port', alias: 'p', type: Number, defaultValue: 5000 },
  { name: 'proxyUrl', type: String, defaultValue: "https://www.biorxiv.org" },
];
var options = commandLineArgs(optionDefinitions);
// remove trailing slash
var proxyUrl = options.proxyUrl.replace(/\/$/, '');

var app = express();
app.use(helmet());

app.use(cors());
app.options('*', cors());

app.use('/', function(req, res) {
  // If '?' in query string, then return data itself
  try {
    console.log('Proxying request -> ' + req.url);
  } catch (e) {}

  if (req.url.startsWith('/?') |
      // Assume static files urls are given by these other urls
      req.url.includes('/files/') |
      req.url.includes('/highwire') |
      req.url.endsWith('.pdf')) {
        
    let request_url = req.url;
    if (request_url.startsWith('/?'))
      request_url = request_url.substring(2); // Remove `/?`

    if (!req.url.startsWith('http'))
      request_url = proxyUrl + request_url;

    req.pipe(request(request_url)).pipe(res);
  } else {
    res.sendFile(path.join(__dirname+'/index.html'));
  }

});

app.listen(options.port);
