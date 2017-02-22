# queue-that-promise [![Build Status](https://travis-ci.org/ajoslin/queue-that-promise.svg?branch=master)](https://travis-ci.org/ajoslin/queue-that-promise)

> Push promises to a queue. The queue runs in order. That's all. 500b gzipped.

## Install

```
$ npm install --save queue-that-promise
```

## Usage

```js
var Queue = require('queue-that-promise')
var queue = Queue()

queue.add(() => new Promise((resolve) => setTimeout(resolve, 100))
  .then(() => console.log('first'))

queue.add(() => new Promise((resolve) => setTimeout(resolve, 100))
  .then(() => console.log('second'))

queue.add(() => new Promise((resolve) => setTimeout(resolve, 100))
  .then(() => console.log('third'))

queue.done().then(() => console.log('done'))

// Wait 100ms...
// => "first"
// Wait 100ms...
// => "second"
// Wait 100ms...
// => "third"
// => "done"
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

#### `queue.count() -> number`

Returns the current length of the queue.

## Related

- [queue-that-callback](https://github.com/ajoslin/queue-that-callback)

## License

MIT © [Andrew Joslin](http://ajoslin.com)
