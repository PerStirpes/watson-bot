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

const sentiment = `Your sentiment analysis is`
const sentiments = [
  { Analytical: `You sound so smart` },
  { Anger: `Why so serious?` },
  { Confident: `it's not that you're cocky, your confident` },
  { Fear: `there's noting to fear except fear itself` },
  { Joy: `🤗` },
  { Sadness: `No need to be sad, here's a candy bar 🍫` },
  { Tentative: `look here's a 🕷` }
]

const log = tap(console.log)

function fpMagic (document_tone) {
  const getScore = prop('score')
  const sortDecending = descend(getScore)
  const sortByScoreDesc = sort(sortDecending)
  const getScoreAndTone = project(['score', 'tone_name'])
  const getTone = prop('tone_name')
  const getLensTone = lensProp('tones')
  const _lens = view(getLensTone, document_tone)
  const getResults = compose(
    toLower,
    getTone,
    head,
    log,
    getScoreAndTone,
    sortByScoreDesc
  )
  return `${sentiment} ${getResults(_lens)}`
}

module.exports = { fpMagic }

// const getTones = R.props(['tone_name','score']) //use to get score&tone : remove toLower
