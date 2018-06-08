const { Transform } = require('stream')
const memory = require('memory-cache')

module.exports = function cache (key, maxAge) {
  if (typeof maxAge !== 'number') {
    throw new Error(`maxAge must be a number (in ms)`)
  }

  const chunks = []

  return new Transform({
    transform (data, enc, cb) {
      maxAge && chunks.push(data)
      cb(null, data)
    },
    flush (cb) {
      maxAge && memory.put(key, Buffer.concat(chunks), maxAge)
      cb()
    }
  })
}
