'use strict'

var test = require('tape')
var Bluebird = require('bluebird')
var nextTick = require('next-tick')
var Queue = require('./')

test('resolve', function (t) {
  t.plan(1)

  var queue = Queue()
  queue.add(Promise.resolve.bind(Promise, 1))
    .then((result) => t.equal(result, 1))
    .catch(t.fail)
})

test('.done() on empty', function (t) {
  t.plan(1)
  var queue = Queue()
  queue.done().then(() => t.end())
})

test.only('.done() after all tasks', function (t) {
  var called = false
  t.plan(2)

  var queue = Queue()
  var resolveOne, resolveTwo

  queue.add(() => new Promise((resolve) => { resolveOne = resolve }))
    .then(() => {
      t.equal(called, false)
      nextTick(resolveTwo)
    })

  queue.add(() => new Promise((resolve) => { resolveTwo = resolve }))
    .then(() => {
      nextTick(() => t.equal(called, true))
    })

  queue.done().then(function (t) {
    called = true
  })
  resolveOne()
})

test('reject', function (t) {
  t.plan(1)

  var queue = Queue()
  queue.add(Promise.reject.bind(Promise, 2))
    .then(t.fail)
    .catch((error) => t.equal(error, 2))
})

test('add with an array', function (t) {
  t.plan(1)

  var results = []
  var queue = Queue()

  queue.add([
    () => results.push('one'),
    () => results.push('two')
  ])
    .then(() => t.deepEqual(results, ['one', 'two']))
})

test('sequences', function (t) {
  var results = []
  var pushResult = results.push.bind(results)
  t.plan(1)

  var queue = Queue()

  queue.add(() => Bluebird.delay(10, '0:success'))
    .then(pushResult)

  queue.add(() => Bluebird.delay(3, Promise.reject('1:fail')))
    .catch(pushResult)

  queue.add(() => Bluebird.delay(100, '2:success'))
    .then(pushResult)
    .then(function () {
      t.deepEqual(results, ['0:success', '1:fail', '2:success'])
    })
})
