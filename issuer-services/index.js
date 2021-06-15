var Web3 = require('web3')

var Config = require('./config.json')
var driver = require('./_driver')
var facebook = require('./_facebook')
var google = require('./_google')
var github = require('./_github')
var simple = require('./_simple')
// var twitter = require('./_twitter')
var linkedin = require('./_linkedin')

console.log(driver)
console.log(google)
console.log(github)

module.exports = function (app) {
  Config.web3 = new Web3()
  driver(app, Config)
  facebook(app, Config)
  google(app, Config)
  github(app, Config)
  simple(app, Config)
  // twitter(app, Config)
  linkedin(app, Config)
}
