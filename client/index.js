const $ = document.body
const list = $.querySelector('#list')

const quotes = fetch('./EliasQuotes.json')
  .then(response => response.json())
  .then(quotes => quotes.map(x => x.quote))
  .then(q => (list.innerHTML = q.map(x => `  <li>${x}</li>`).join('')))
  .catch(console.error)

const toneButton = $.querySelector('#watson-chat').addEventListener(
  'click',
  () => (location = '#watson-chat')
)
