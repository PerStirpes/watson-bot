const {
  descend,
  compose,
  head,
  lensProp,
  pipe,
  project,
  prop,
  propOr,
  sort,
  tap,
  toLower,
  view
} = require('ramda')

const sentiments = {
  analytical: `Smart people build businesses, wise people build relationships`,
  anger: `Why so serious?`,
  confident: `Confidence is silent. Insecurities are loud`,
  fear: `listen to this bit.ly/seekingwisdom-60`,
  joy: `🤗 here's a pony 🐴`,
  sadness: `Sadness does not come from bad circumstances. It comes from bad thoughts`,
  tentative: `look here's a 🕷`
}
const sentiment = `Your sentiment analysis is`
const log = tap(console.log)

function fpMagic (document_tone) {
  const getScore = prop('score')
  const sortDecending = descend(getScore)
  const sortByScoreDesc = sort(sortDecending)
  const getScoreAndTone = project(['score', 'tone_name'])
  const getTone = propOr('default', 'tone_name')
  const getLensTone = lensProp('tones')
  const _lens = view(getLensTone, document_tone)
  const operate = pipe(
    sortByScoreDesc,
    getScoreAndTone,
    head,
    getTone,
    toLower,
    log
  )

  const result = operate(_lens)

  return result === 'default'
    ? `Sorry, I'm still learning, try sending a different messaging`
    : `${sentiment} <b>${result}</b>, ${sentiments[result]}`
}

module.exports = { fpMagic }

// const getTone = prop('tone_name')
// const getScore = propOr('Default', 'score')
// const getTones = R.props(['tone_name','score']) //use to get score&tone : remove toLower
