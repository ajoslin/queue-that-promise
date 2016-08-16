# queue-that-promise [![Build Status](https://travis-ci.org/ajoslin/queue-that-promise.svg?branch=master)](https://travis-ci.org/ajoslin/queue-that-promise)

> Push promises to a queue. The queue runs in order. That's all.

## Install

```
$ npm install --save queue-that-promise
```

## Usage

The example below uses Bluebird's [`Bluebird.delay`](http://bluebirdjs.com/docs/api/promise.delay.html) to make the example easy to understand.

```js
var Queue = require('queue-that-promise')
var Bluebird = require('bluebird')

var queue = Queue()

queue.add(() => Bluebird.delay(100, Promise.resolve('100ms later'))
  .then((result) => assert.equal(result, '100ms later'))

queue.add(() => Bluebird.delay(100, Promise.reject('100ms after the first'))
  .catch((error) => assert.equal(error, '100ms after the first'))

queue.add(() => Bluebird.delay(50, Promise.resolve('50ms after the second'))
  .then((result) => assert.equal(result, '50ms after the second'))
```

## API

#### `Queue()` -> `queue`

Returns a queue instance.

#### `queue.done() -> Promise`

Returns a promise that will be resolved once the queue is empty.

#### `queue.add(callback<Promise> | Array<callback<Promise>>) -> Promise`

Adds a callback or multiple callbacks to the queue.

The callback will run after all previously added callbacks have finished.

Returns a promise that will be resolved or rejected once the given callback's returned promise is resolved or rejected.

## Related

- [queue-that-callback](https://github.com/ajoslin/queue-that-callback)

## License

MIT © [Andrew Joslin](http://ajoslin.com)
