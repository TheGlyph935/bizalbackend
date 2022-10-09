const blogs = require('../blogsExamples').blogs
const mostTotalLikes = require('../utils/list_helper').mostTotalLikes

describe('Author with the most Likes', () => {
  test('Only 1 top author', () => {
    const result = mostTotalLikes(blogs)
    console.log(result)
    expect(result).toBe(JSON.stringify({
      author: 'Edsger W. Dijkstra',
      likes: 17
    }))
  })
})