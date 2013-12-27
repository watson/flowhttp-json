'use strict';

var util = require('util');
var JSONStream = require('JSONStream');
var PassThrough = require('stream').PassThrough;

// A PassThrough stream that automatically parses a JSON HTTP response
var JsonParser = function () {
  var parser = this;
  if (!(this instanceof JsonParser))
     return new JsonParser();

  PassThrough.call(this);

  // Listen for the special `response` event emitted by the flowHttp
  // module
  this.once('response', function (res) {
    // Forward the `response` event down the pipe-line
    parser._forwardFlowHttpResponse(res);
    if (res.headers['content-type'] === 'application/json') {
      parser._writableState.objectMode = true;
      parser._readableState.objectMode = true;
      parser._src.unpipe(parser);
      parser._src.pipe(JSONStream.parse()).pipe(parser);
    }
  });

  // Record the source of the pipe to be used above
  this.once('pipe', function (src) {
    parser._src = src;
  });
};

util.inherits(JsonParser, PassThrough);

module.exports = JsonParser;
