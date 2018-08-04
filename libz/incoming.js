const fetch = require('node-fetch')
const rp = require('request-promise')
const { JOKES_API } = process.env
const { sendDriftMessage } = require('./outgoing')
const debug = require('debug')('server:incoming:jokes')

const options = {
  uri: JOKES_API,
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

// below are some skeletons, I abandoned my first async attempt at the assignment
// not working, but I did have plans to use the fetchSearchTermJoke function.
const fetchSearchTermJoke = async term => {
  const jokeSearch = `${JOKES_API}search?term=${term}`
  const jokes = await fetchJokes(jokeSearch)
    .then(res => res.json())
    .catch(err => console.error(err))
  debug('Bunch of %o jokes', jokes)
  return response
}

async function fetchJokes (url) {
  debug('resolving %s by joke url', url)
  const headers = { Accept: 'application/json' }
  const jokes = await fetch(url, { headers })
    .then(res => res.json())
    .catch(err => console.error(err))
  return jokes
}
