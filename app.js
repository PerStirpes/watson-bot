const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const debug = require('debug')
const { DRIFT_VERIFICATION_TOKEN } = process.env
const { handleMessage } = require('./libz/incoming')

// debugging tools lines 10 - 18
const Raven = require('raven')
Raven.config(
  'https://ef897a7e139c44b6a597c6b6a65147bc@sentry.io/1249642'
).install()
app.use(Raven.requestHandler())
app.use(Raven.errorHandler())
app.use(function onError (err, req, res, next) {
  console.error(err.message)
  res.status(500).end(`${res.sentry} ${err.message}` + '\n')
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', authorize, status)

app.post('/joke', authorize, joker)

function authorize ({ body }, res, next) {
  if (DRIFT_VERIFICATION_TOKEN !== body.token) {
    return res.status(401).send('Not authorized')
  }
  return next()
}

function status (_, response) {
  response.send(`<style>body {display: flex;justify-content: center;
    align-items: center;} span {font-size: 45px;font-family: Arial;}</style>
    <span>🧚‍ We Are Live!, keep calm and code on 🧚</span>`)
}

function joker ({ body }, response) {
  const { type, orgId, data } = body
  debug('body %O', body)

  if (type === 'new_message') {
    const kickoff = '<p>Okay, getting a joke asap!</p>'
    if (data.body === kickoff) {
      handleMessage(data, orgId)
    }
    // handle search text
    // if (data.body.includes('/joke ')) {
    //   debug('data.body', data.body)
    //   // handleMessage(data, orgId)
    // }
  }
  return response.send('ok')
}

module.exports = app
