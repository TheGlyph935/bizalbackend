const blogs = require('../blogsExamples').blogs
const mostLikes = require('../utils/list_helper').mostLikes

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

describe('Most likes in a list of blogs', () => {

  test('One blog returns its number of likes', () => {
    const result = mostLikes(listWithOneBlog)
    expect(result).toBe(listWithOneBlog[0])
  })

  test('Most likes of multiple blogs', () => {
    const result = mostLikes(blogs)
    expect(result).toBe(blogs[2])
  })
})