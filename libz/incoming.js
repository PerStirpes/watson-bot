// const fetch = require('node-fetch')
require('dotenv').config()

const { sendDriftMessage } = require('./postMessageToDrift')
const debug = require('debug')('server:incoming:jokes')
const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3')

const toneAnalyzer = new ToneAnalyzerV3({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  version: '2017-09-21'
})
const {
  descend,
  compose,
  head,
  lensProp,
  project,
  prop,
  sort,
  tap,
  toLower,
  view
} = require('ramda')
// const getTones = R.props(['tone_name','score']) //use to get score&tone : remove toLower
const log = tap(console.log)
function ram (document_tone) {
  const getScore = prop('score')
  const sortDecending = descend(getScore)
  const sortByScoreDesc = sort(sortDecending)
  const getScoreAndTone = project(['score', 'tone_name'])
  const getTone = prop('tone_name')
  const getResults = compose(
    toLower,
    getTone,
    head,
    getScoreAndTone,
    sortByScoreDesc
  )
  const getLensTone = lensProp('tones')
  const _lens = view(getLensTone, document_tone)
  const render = getResults(_lens)
  return render
}
/*
handle incoming request, pass message and preps for response
*/
function handleMessage (data, orgId, cb = toneAnalyzer) {
  const { body, conversationId } = data

  const toneParams = {
    tone_input: { text: body },
    content_type: 'application/json',
    headers: {
      'Custom-Header': '{header_value}',
      'User-Agent': 'tone-analyzer'
    }
  }

  cb.tone(toneParams, function (err, response) {
    if (err) {
      console.log(err)
    }

    // console.log('====================================')
    // console.log(('response', JSON.stringify(response, null, 2)))
    // console.log('====================================')
    const { document_tone } = response
    console.log('doc tone', JSON.stringify(document_tone, null, 2))
    var result = ram(document_tone)
    console.log('====================================')
    console.log(result)
    console.log('====================================')

    sendDriftMessage(result, conversationId, orgId)
  })
  //   .catch(function(err) {
  //     throw new Error('something went wrong with rp' + err)
  //   })
}

module.exports = { handleMessage }

// const { identity, compose, fromPairs, map, split, tail, tap } = R

// const {
//   descend,
//   compose,
//   lensProp,
//   project,
//   prop,
//   sort,
//   tap,
//   view,
// } = require('ramda')
// //const getTones = R.props(['tone_name','score']) //use to get score&tone : remove toLower
// const log = tap(console.log)

// const getScore = prop('score')
// const sortDecending = descend(getScore)
// const sortByScoreDesc = sort(sortDecending)
// const getScoreAndTone = project(['score', 'tone_name'])
// const getTone = prop('tone_name')
// const getResults = compose(
//   R.toLower,
//   getTone,
//   R.head,
//   getScoreAndTone,
//   sortByScoreDesc,
// )
// const getLensTone = lensProp('tones')
// const _lens = view(getLensTone, document_tone)
// const render = getResults(_lens)

// `${render} Why so serious` angry chat
// Your sentiment analysis is
// log(`Your sentiment analysis is ${render}, You sound smart`)
