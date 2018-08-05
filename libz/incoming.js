// const fetch = require('node-fetch')
const rp = require('request-promise')
const { WATSON_URL } = process.env
const { sendDriftMessage } = require('./outgoing')
const debug = require('debug')('server:incoming:jokes')

const options = {
  uri: WATSON_URL,
  headers: {
    'User-Agent': 'Request-Promise',
    Accept: 'application/json'
  },
  json: true
}
/*
handle incoming request, pass message and preps for response
*/
function handleMessage (data, orgId, config = options) {
  rp(config)
    .then(response => {
      const { joke } = response
      return sendDriftMessage(joke, data.conversationId, orgId)
    })
    .catch(function (err) {
      throw new Error('something went wrong with rp' + err)
    })
}

module.exports = { handleMessage }
