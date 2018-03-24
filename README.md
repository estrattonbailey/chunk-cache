# chunk-cache
Simple caching for streamed HTML.

## Install
```
npm i chunk-cache --save
```

# Usage
```javascript
const app = require('connect')()
const router = require('router')()
const cache = require('chunk-cache')

router.get('*', (req, res) => {
  const hit = cache(req.originalUrl)

  if (hit) {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.write(hit)
    res.end()
  }

  const cacheStream = cache(req.originalUrl, 60 * 60 * 1000)

  cacheStream.pipe(res)

  res.writeHead(200, { 'Content-Type': 'text/html' })

  cacheStream.write(`<!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>chunk-cache</title>
      </head>
      <body>
        <div id='root'>`
  )

  const renderStream = renderToStream(/* render something */)

  renderStream.pipe(cacheStream, { end: false })

  renderStream.on('end', () => {
    cacheStream.write(`</div>
        </body>
      </html>
    `)

    cacheStream.end()
  })
})
```

# Inspiration
- [Streaming Server-Side Rendering and Caching at Spectrum](https://zeit.co/blog/streaming-server-rendering-at-spectrum)

## License
MIT License © [Eric Bailey](https://estrattonbailey.com)
