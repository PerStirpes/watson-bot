const fetch = require('node-fetch')
const { DRIFT_ACCESS_TOKEN, DRIFT_CONVO_API } = process.env
const debug = require('debug')('server:outgoing:jokes')
const { stringify } = JSON

/*
 ☎️  third party joke API
*/
function sendDriftMessage (message, conversationId, orgId) {
  const driftMessage = {
    orgId: `${orgId}`,
    body: JSON.stringify(message),
    type: 'chat'
  }
  postResponse(driftMessage, conversationId)
}

/*
 Post message to chat service
*/
function postResponse (message, conversationId) {
  const URL = `${DRIFT_CONVO_API}/${conversationId}/messages`

  return fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DRIFT_ACCESS_TOKEN}`
    },
    body: stringify(message)
  }).catch(err => console.error(err))
}

module.exports = { sendDriftMessage, postResponse }
