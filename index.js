// modules
// -------
// Only core modules are allowed + bucker itself!

var http    = require('http');
var brc     = require('./brc');
var logger  = require('bucker').createLogger(brc);

// HTTP Server
// -----------
// If you want to use https, use a proxy infront :) this one has one (!) single use cas
// to be a fast and useful log receiver.

http.createServer(function (req, res) {
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PUT, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-PINGOTHER, Content-Type'});
    res.end();
    return;
  }

  if (req.method === 'GET') {
    res.writeHead(200, {'content-type': 'text/javascript'});
    var frontendjs = "";
    frontendjs += "function buckerlogToReceiver (level, msg, options) {";
    frontendjs += "  var logObj = {level: level, msg: msg};";
    frontendjs += "  if (options) {";
    frontendjs += "    if (options.email) {";
    frontendjs += "      logObj.email = true;";
    frontendjs += "    }";
    frontendjs += "  }";
    frontendjs += "  var xmlHttpRequest = new XMLHttpRequest();";
    frontendjs += "  xmlHttpRequest.onload = function (xmlHttpEvent) {";
    frontendjs += "    var resp = JSON.parse(xmlHttpEvent.target.response);";
    frontendjs += "    if (!resp.success) console.error('[Request::put] HTTP Request ['+'http://'+window.location.host+'] returned an error!');";
    frontendjs += "  };";
    frontendjs += "  xmlHttpRequest.onerror = function (xmlHttpEvent) {";
    frontendjs += "    console.error('[Request::put] HTTP Request ['+'http://'+window.location.host+'] failed!');";
    frontendjs += "  };";
    frontendjs += "  xmlHttpRequest.open('PUT', 'http://"+brc.receiver.endpoint+":"+brc.receiver.port+"');";
    frontendjs += "  xmlHttpRequest.send(JSON.stringify(logObj));";
    frontendjs += "  return true;";
    frontendjs += "}";
    frontendjs += "window.bucker = {";
    frontendjs += "  debug:    function (msg, options) { buckerlogToReceiver('debug', msg, options); },";
    frontendjs += "  log:      function (msg, options) { buckerlogToReceiver('log', msg, options); },";
    frontendjs += "  info:     function (msg, options) { buckerlogToReceiver('info', msg, options); },";
    frontendjs += "  warn:     function (msg, options) { buckerlogToReceiver('warn', msg, options); },";
    frontendjs += "  warning:  function (msg, options) { buckerlogToReceiver('warning', msg, options); },";
    frontendjs += "  error:    function (msg, options) { buckerlogToReceiver('error', msg, options); },";
    frontendjs += "  access:   function (msg, options) { buckerlogToReceiver('access', msg, options); }";
    frontendjs += "};";
    res.end(frontendjs);
    return;
  } else if (req.method === 'PUT') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PUT, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-PINGOTHER, Content-Type'});

    var incomingJSONData = "";
    req.on('data', function (d) {
      incomingJSONData += d;
    });
    req.on('end', function () {
      var data;
      try {
        data = JSON.parse(incomingJSONData);
      } catch (e) {
        res.writeHead(404); res.end('Corrupt JSON Data!');
        return;
      }

      if (!data.hasOwnProperty('level') || !data.hasOwnProperty('msg')) {
        res.writeHead(404); res.end('You have to provide level and msg properties!');
        return;
      }

      if (data.hasOwnProperty('email') && data.email === true) logger[data.level](data.msg).email();
      else logger[data.level](data.msg);

      res.end(JSON.stringify({success: true, logged: data.msg, loglevel: data.level}));
    });
  } else {
    console.log('not put not get!', req.method);
  }
}).listen(process.env.PORT || brc.receiver.port);

logger.log('Bucker receiver is listining on port:', process.env.PORT || brc.receiver.port);