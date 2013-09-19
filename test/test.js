var assert = require('assert');
var http = require('http');
var brc = require('./../brc');
require('./../index');

console.log('testing bucker-receiver');
var req = http.request({
  host: brc.receiver.endpoint,
  port: brc.receiver.port,
  method: 'PUT',
  headers: {
    "content-type": "application/json"
  }
}, function (res) {
  res.setEncoding('utf8');
  res.on('data', function (data) {
    assert.equal(res.statusCode, 200, 'status codes are getting messed up');
    assert.ok(JSON.parse(data).success, 'everything is working');
    assert.equal(JSON.parse(data).logged, "testlog: hello world", 'strange');
    process.exit(0);
  });
});
req.on('error', function (e) { console.error(e); });
req.write(JSON.stringify({msg: "testlog: hello world", level: "log"}));
req.end();