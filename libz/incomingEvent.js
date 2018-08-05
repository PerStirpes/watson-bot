require('dotenv').config()
const { sendDriftMessage } = require('./postMessageToDrift')
const { fpMagic } = require('./magic')
const debug = require('debug')('server:incoming:jokes')
const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3')

const toneAnalyzer = new ToneAnalyzerV3({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  version: '2017-09-21'
})

/*
handle incoming request, pass message and preps for response
*/
function handleMessage ({ body, conversationId }, orgId, cb = toneAnalyzer) {
  // const { body, conversationId } = data

  const toneParams = {
    tone_input: { text: body },
    content_type: 'application/json',
    headers: {
      'Custom-Header': '{header_value}',
      'User-Agent': 'tone-analyzer'
    }
  }

  cb.tone(toneParams, function (err, { document_tone }) {
    if (err) {
      console.log(err)
    }
    const result = fpMagic(document_tone)
    sendDriftMessage(result, conversationId, orgId)
  })
  //   .catch(function(err) {
  //     throw new Error('something went wrong with rp' + err)
  //   })
}

module.exports = { handleMessage }
