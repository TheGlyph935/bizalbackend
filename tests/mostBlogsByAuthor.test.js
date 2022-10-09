const mostBlogs = require('../utils/list_helper').mostBlogs
const blogs = require('../blogsExamples').blogs
const blogsTwo = require('../blogsExamples').blogsTwo

describe('Most blogs an author has written', () => {
  test('Array where an author writes 2+ blogs', () => {
    const result = mostBlogs(blogs)
    const expectedOutput = {
      author: 'Robert C. Martin',
      blogCount: 3
    }
    expect(result).toBe(JSON.stringify(expectedOutput))
  })

  test('Array with two same authors', () => {
    const result = mostBlogs(blogsTwo)
    const expectedOutput = {
      author: 'Robert C. Martin',
      blogCount: 3
    }
    expect(result).toBe(JSON.stringify(expectedOutput))
  })
})