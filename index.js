'use strict'

module.exports = PromiseQueue

function PromiseQueue () {
  var queue = []
  var doneCallbacks = []

  return {
    add: add,
    done: done
  }

  function add (task) {
    if (Array.isArray(task)) {
      return Promise.all(task.map(add))
    }

    return new Promise(function (resolve, reject) {
      queue.push(function wrapTask () {
        var result = Promise.resolve(task())
        result.then(resolve).catch(reject)

        return result
      })

      if (queue.length === 1) {
        run(queue[0])
      }
    })
  }

  function done () {
    if (queue.length === 0) return Promise.resolve()

    return new Promise(function (resolve) {
      doneCallbacks.push(resolve)
    })
  }

  function run (task) {
    return task()
      .then(runNext)
      .catch(runNext)
  }

  function runNext () {
    queue.shift()
    if (!queue.length) {
      doneCallbacks.forEach(function (callback) {
        callback()
      })
      doneCallbacks.length = 0
      return
    }

    return run(queue[0])
  }
}
