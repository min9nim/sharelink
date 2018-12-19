//const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const PORT = process.env.PORT

const express = require('express')
const cookieParser = require('cookie-parser')

app.prepare().then(() => {
  const server = express();
  server.use(cookieParser());
  
  //createServer((req, res) => {
  server.use((req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl

    if (pathname === '/my' ) {
      app.render(req, res, '/', query)
    } else if (pathname === '/like') {
      app.render(req, res, '/', query)
    } else if (pathname === '/read') {
      app.render(req, res, '/', query)
    } else if (pathname === '/toread') {
      app.render(req, res, '/', query)
    } else {
      handle(req, res, parsedUrl)
    }
  }).listen(PORT, err => {
    if (err) throw err
    //console.log('> Ready on http://localhost:3000')
    console.log(`Next server is running on PORT ${PORT}`)
  })
})