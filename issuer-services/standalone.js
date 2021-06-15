const express = require('express')
const session = require('express-session')
const crypto = require('crypto')
const WebSocket = require('ws')
const serveStatic = require('serve-static')

global.XMLHttpRequest = require('xhr2')
global.window = { Promise, WebSocket, crypto }

var driver = require('./_driver')
var simple = require('./_simple')
var facebook = require('./_facebook')
var google = require('./_google')
var github = require('./_github')
var linkedin = require('./_linkedin')

console.log(driver)
console.log(google)
console.log(github)

var Web3 = require('./public/vendor/web3.min')

let Config = require('./config.json')
Config.web3 = new Web3(Config.provider)

const app = express()
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`)
    } else {
      next()
    }
  })
}
app.use(serveStatic('public'))
app.use(
  session({
    secret: 'top secret string',
    resave: false,
    saveUninitialized: true
  })
)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})

driver(app, Config)
simple(app, Config)
facebook(app, Config)
google(app, Config)
github(app, Config)
linkedin(app, Config)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`\nListening on port ${PORT}\n`)
})
