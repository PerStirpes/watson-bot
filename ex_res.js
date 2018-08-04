const { identity, compose, fromPairs, map, split, tail, tap } = R
const log = tap(console.log)

var response = {
  document_tone: {
    tones: [
      {
        score: 0.6165,
        tone_id: 'sadness',
        tone_name: 'Sadness'
      },
      {
        score: 0.829888,
        tone_id: 'analytical',
        tone_name: 'Analytical'
      }
    ]
  },
  sentences_tone: [
    {
      sentence_id: 0,
      text: 'Team, I know that times are tough!',
      tones: [
        {
          score: 0.801827,
          tone_id: 'analytical',
          tone_name: 'Analytical'
        }
      ]
    },
    {
      sentence_id: 1,
      text:
        'Product sales have been disappointing for the past three quarters.',
      tones: [
        {
          score: 0.771241,
          tone_id: 'sadness',
          tone_name: 'Sadness'
        },
        {
          score: 0.687768,
          tone_id: 'analytical',
          tone_name: 'Analytical'
        }
      ]
    },
    {
      sentence_id: 2,
      text:
        'We have a competitive product, but we need to do a better job of selling it!',
      tones: [
        {
          score: 0.506763,
          tone_id: 'analytical',
          tone_name: 'Analytical'
        }
      ]
    }
  ]
}


{prop, descend, sort, project, compose, lensProp, view} = R
//const getTones = R.props(['tone_name','score']) //use to get score&tone : remove toLower
const getScore = R.prop('score')
const sortDecending = R.descend(getScore)
const sortByScoreDesc = R.sort(sortDecending)
const getScoreAndTone = R.project(['score', 'tone_name'])
const getTone = R.prop('tone_name')
const getResults = R.compose(R.toLower, getTone, R.head, getScoreAndTone, sortByScoreDesc)
const getLensTone = R.lensProp('tones')
const _lens = R.view(getLensTone, document_tone)
const render = getResults(_lens)

// `${render} Why so serious` angry chat 
//Your sentiment analysis is 
log(`Your sentiment analysis is ${render}, You sound smart`)
