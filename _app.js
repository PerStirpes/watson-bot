const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { DRIFT_VERIFICATION_TOKEN } = process.env
const { handleMessage } = require('./lib/incoming')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', authorize, status)

// app.post('/tone', authorize, joker)

app.post('/tone', authorize, tonyTheTiger)

function authorize ({ body }, res, next) {
  if (DRIFT_VERIFICATION_TOKEN !== body.token) {
    return res.status(401).send('Not authorized')
  }
  return next()
}

function tonyTheTiger (req, res, next) {
  toneAnalyzer.tone(req.body, function (err, data) {
    if (err) {
      return next(err)
    }
    return res.json(data)
  })
}

function status (_, response) {
  response.send(`<style>body {display: flex;justify-content: center;
    align-items: center;} span {font-size: 45px;font-family: Arial;}</style>
    <span>🧚‍ We Are Live!, keep calm and code on 🧚</span>`)
}

function joker ({ body }, response) {
  const { type, orgId, data } = body

  if (type === 'new_message') {
    const kickoff = '<p>Okay, getting a joke asap!</p>'
    if (data.body === kickoff) {
      handleMessage(data, orgId)
    }
  }
  return response.send('ok')
}

module.exports = app
