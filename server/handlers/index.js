const { handleMessage } = require('../libz/incomingEvent')
const { DRIFT_VERIFICATION_TOKEN } = process.env
const debug = require('debug')('routes')

function toneLoc ({ body }, response) {
  const { type, orgId, data: { author }, data } = body

  if (type === 'new_message' && author.bot === false) {
    console.log('===================================x=')
    debug('what are we sending %O', data)
    console.log('====================================')
    handleMessage(data, orgId)
  }
  response.send('ok')
}

function authorize ({ body: { token } }, res, next) {
  if (DRIFT_VERIFICATION_TOKEN !== token) {
    return res.status(401).send('Not authorized')
  }
  return next()
}

function status (request, response) {
  response.status(200).send(`<style>body {display: flex;justify-content: center;
    align-items: center;} span {font-size: 45px;font-family: Arial;}</style>
    <span>🧚‍ We Are Live!, keep calm and code on 🧚</span>`)
}

module.exports = { authorize, status, toneLoc }
