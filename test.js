'use strict';

var assert = require('assert');
var http = require('http');
var JSONStream = require('JSONStream');
var HelloWorld = require('stream').Readable;
var PassThrough = require('stream').PassThrough;
var fh = require('flowhttp');
var JsonParser = require('./index');

// The data being sent back from the server on each request
var bodyObj = { hello: 'world' };
HelloWorld.prototype._read = function (n) {
  this.push(JSON.stringify(bodyObj));
  this.push();
};

fh.agent = false; // opt out of connection pooling - makes the tests fail

describe('JsonParser', function () {
  it('should be a PassThrough stream', function () {
    assert(JsonParser.prototype instanceof PassThrough, 'The Stream object should be an instance of stream.PassThrough');
  });
});

describe('jsonParser', function () {
  var options = {
    host: 'localhost',
    port: 5000
  };
  var server;

  before(function (done) {
    server = http.createServer(function (req, res) {
      if (req.headers['accept'] === 'application/json')
        res.writeHead(200, { 'Content-Type': 'application/json' });
      var helloWorld = new HelloWorld();
      helloWorld.pipe(res);
    });
    server.listen(options.port, done);
  });

  after(function () {
    server.close();
  });

  it('should get the expected result if no encoding is used', function (done) {
    options.headers = {};
    fh(options)
      .pipe(new JsonParser())
      .on('data', function (chunk) {
        assert.strictEqual(chunk.toString(), JSON.stringify(bodyObj));
      })
      .on('end', done);
  });

  it('should automatically parse a JSON response', function (done) {
    options.headers = { 'Accept': 'application/json' };
    fh(options)
      .pipe(new JsonParser())
      .on('data', function (chunk) {
        assert.deepEqual(chunk, bodyObj);
      })
      .on('end', done);
  });
});
