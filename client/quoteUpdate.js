const svg = d3.select('svg')
const width = +svg.attr('width')
const height = +svg.attr('height')

const g = svg
  .append('g')
  .attr('transform', `translate(28, ${height / 2})`)
  .style('font-size', '20px')

d3.json('./EliasQuotes.json', (error, quotes) => {
  if (error) throw error

  const EliasQuotes = quotes.map(x => x.quote)
  const length = EliasQuotes.length - 1

  function update (data) {
    const t = d3.transition().duration(14500)

    // JOIN new data with old elements
    const text = g.selectAll('text').data(data, d => d)
    
    // EXIT old elements not present in new data
    text
      .exit()
      .attr('class', 'exit')
      .transition(t)
      .attr('y', 100)
      .style('fill-opacity', 1e-6)
      .remove()

    // UPDATE old elements present in new data
    text
      .attr('class', 'update')
      .attr('y', 0)
      .style('fill-opacity', 1)
      .transition(t)
      .attr('x', (d, i) => i * 20)

    // ENTER new elements present in new data
    text
      .enter()
      .append('text')
      .attr('class', 'enter')
      .attr('dy', '.35em')
      .attr('y', -60)
      .attr('x', (d, i) => i * 20)
      .style('fill-opacity', 1e-6)
      .text(d => d)
      .transition(t)
      .attr('y', 0)
      .style('fill-opacity', 1)
  }

  update(EliasQuotes[getRandomIndex(0, length)])

  d3.interval(() => {
    const randomIndex = EliasQuotes[getRandomIndex(0, length)]
    update(randomIndex)
  }, 15500)
})

function getRandomIndex (floor, ceiling) {
  const randomNumber = Math.random() * (ceiling - floor + 1)
  return Math.floor(randomNumber) + floor
}
