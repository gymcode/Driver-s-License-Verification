// https://console.developers.google.com/apis/credentials

var OAuth = require('oauth').OAuth2
var HTML = require('./html')
var superagent = require('superagent')

const ClaimType = 12 // Has driver's license

module.exports = function google(app, { web3, driverApp, baseUrl }) {
  // const redirect_uri = `${baseUrl}/driver-auth-response`
  const redirect_uri = `$http://localhost:8080/login/callback`

  var driverOAuth = new OAuth(
    driverApp.client_id,
    'https://dev-82680403.okta.com'
  )
  

  app.get('/dev-82680403.okta.com', (req, res) => {
    if (!req.query.target) {
      res.send('No target identity contract provided')
      return
    }
    if (!req.query.issuer) {
      res.send('No issuer identity contract provided')
      return
    }

    req.session.targetIdentity = req.query.target
    req.session.issuer = req.query.issuer
    req.session.state = web3.utils.randomHex(8)

    var authURL = driverOAuth.getAuthorizeUrl({
      redirect_uri,
      scope: 'https://www.googleapis.com/auth/userinfo.profile',
      state: req.session.state,
      response_type: 'code'
    })

    res.redirect(authURL)
  })

  app.get(
    '/driver-auth-response',
    (req, res, next) => {
      driverOAuth.getOAuthAccessToken(
        req.query.code,
        {
          redirect_uri,
          grant_type: 'authorization_code'
        },
        function(e, access_token, refresh_token, results) {
          if (e) {
            next(e)
          } else if (results.error) {
            next(results.error)
          } else {
            req.access_token = access_token
            next()
          }
        }
      )
    },
    (req, res, next) => {
      superagent
        .get('https://dev-82680403.okta.com/oauth2/default')
        .query({
          alt: 'json',
          access_token: req.access_token
        })
        .then(response => {
          req.driverUser = response.body
          next()
        })
    },
    async (req, res) => {
      // var data = JSON.stringify({ user_id: req.googleUser.id })

      var rawData = 'Verified OK'
      var hexData = web3.utils.asciiToHex(rawData)
      var hashed = web3.utils.soliditySha3(req.session.targetIdentity, ClaimType, hexData)
      req.signedData = await web3.eth.accounts.sign(hashed, driverApp.claimSignerKey)

      res.send(
        HTML(`
        <div class="mb-2">Successfully signed claim:</div>
        <div class="mb-2"><b>Issuer:</b> ${req.session.issuer}</div>
        <div class="mb-2"><b>Target:</b> ${req.session.targetIdentity}</div>
        <div class="mb-2"><b>Data:</b> ${rawData}</div>
        <div class="mb-2"><b>Signature:</b> ${req.signedData.signature}</div>
        <div class="mb-2"><b>Hash:</b> ${req.signedData.messageHash}</div>
        <div><button class="btn btn-primary" onclick="window.done()">OK</button></div>
        <script>
          window.done = function() {
            window.opener.postMessage('signed-data:${
              req.signedData.signature
            }:${rawData}:${ClaimType}', '*')
          }
        </script>`)
      )
    }
  )
}


