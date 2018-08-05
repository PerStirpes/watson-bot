const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const debug = require('debug')('app')
const { DRIFT_VERIFICATION_TOKEN } = process.env
const { handleMessage } = require('./libz/incoming')

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

const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3')
require('dotenv').config()

const toneAnalyzer = new ToneAnalyzerV3({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  version: '2017-09-21'
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', authorize, status)

app.post('/tone', authorize, tonyTheTiger)

function tonyTheTiger ({ body }, response, next) {
  const { type, orgId, data } = body
  if (type === 'new_message') {
    debug('what are we sending %O', data)
    // handleMessage(data, orgId)
  }
  response.send('ok')
  // toneAnalyzer.tone(body, function(err, data) {
  //   if (err) {
  //     return next(err)
  //   }
  //   return response.json(data)
  // })
}
function authorize ({ body: { token } }, res, next) {
  if (DRIFT_VERIFICATION_TOKEN !== token) {
    return res.status(401).send('Not authorized')
  }
  return next()
}

function status (_, response) {
  response.send(`<style>body {display: flex;justify-content: center;
    align-items: center;} span {font-size: 45px;font-family: Arial;}</style>
    <span>🧚‍ We Are Live!, keep calm and code on 🧚</span>`)
}

module.exports = app
