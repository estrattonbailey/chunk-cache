const { Transform } = require('stream')
const memory = require('memory-cache')

function stream (key, maxAge) {
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

module.exports = function cache (key, maxAge) {
  if (maxAge === 0) {
    return stream(key, maxAge)
  } else if (!maxAge) {
    return memory.get(key)
  } else if (typeof maxAge !== 'number') {
    throw new Error(`maxAge must be a number (in ms)`)
  }

  return stream(key, maxAge)
}
