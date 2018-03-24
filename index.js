const { Transform } = require('stream')
const memory = require('memory-cache')

module.exports = function cache (key, maxAge) {
  if (!maxAge) {
    return memory.get(key)
  } else if (typeof maxAge !== 'number') {
    throw new Error(`maxAge must be a number (in ms)`)
  } else {
    const chunks = []

    return new Transform({
      transform (data, enc, cb) {
        chunks.push(data)
        cb(null, data)
      },
      flush (cb) {
        memory.put(key, Buffer.concat(chunks), maxAge)
        cb()
      }
    })
  }
}
