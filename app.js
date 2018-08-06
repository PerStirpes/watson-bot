const app = require('express')()
const cors = require('cors')
const { json, urlencoded } = require('body-parser')
const { authorize, status, toneLoc } = require('./server/handlers')
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

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: false }))

app.get('/', authorize, status)

app.post('/tone', authorize, toneLoc)

module.exports = app
