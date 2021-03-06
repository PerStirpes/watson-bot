const { sendDriftMessage } = require('./postMessageToDrift')
const { fpMagic } = require('./magic')
const debug = require('debug')('server:incoming:events')
const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3')

const toneAnalyzer = new ToneAnalyzerV3({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  version: '2017-09-21'
})

function handleMessage ({ body, conversationId }, orgId, cb = toneAnalyzer) {
  const toneParams = {
    tone_input: { text: body },
    content_type: 'application/json',
    headers: {
      'Custom-Header': '{header_value}',
      'User-Agent': 'tone-analyzer'
    }
  }

  cb.tone(toneParams, (err, { document_tone }) => {
    const result = fpMagic(document_tone)
    debug('ramda magic', result)
    err ? console.error(err) : sendDriftMessage(result, conversationId, orgId)
  })
}

module.exports = { handleMessage }
