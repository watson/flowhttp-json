# flowHttp-json

A [flowHttp](https://github.com/watson/flowhttp) extension used to
parse a JSON HTTP response.

[![build
status](https://secure.travis-ci.org/watson/flowhttp-json.png)](http://travis-ci.org/watson/flowhttp-json)

## Install

```
npm install flowhttp-json
```

## Usage

This module is intended to be used with the
[flowHttp](https://github.com/watson/flowhttp) module.

Use this module to create a `JsonParser` stream. If piped data from a
`flowHttp` request, it will detect if the response has the content-type
`application/json` in which case it will parse it automatically and pipe
the parsed object down the stream.

If you know that the response is **always** JSON, you should use the
[JSONStream](https://github.com/dominictarr/JSONStream) module instead.
This module will only try to parse the response as JSON if the
content-type allows it.

```javascript
var flowHttp = require('flowhttp');
var JsonParser = require('flowhttp-json');

flowHttp('http://example.com/foo.json')
  .pipe(new JsonParser())
  .pipe(process.stdout);
```

## License

MIT
