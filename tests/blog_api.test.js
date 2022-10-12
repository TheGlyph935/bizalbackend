/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const initialBlogs = require('./test_helper').initialBlogs
const blogsInDb = require('./test_helper').blogsInDb
const jwt = require('jsonwebtoken')
const { response } = require('express')
const { result } = require('lodash')


//makes sure database is cleared and always the same before running tests

beforeEach(async () => {
  await Blog.deleteMany({})
  console.log('cleared')

  const blogsArray = initialBlogs.map(blog => new Blog(blog))
  const promisesArray = blogsArray.map(model => model.save())
  await Promise.all(promisesArray)

  console.log('done')
}, 100000)

describe('initially saved blogs in database', () => {
  test('blogs returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    console.log('Entered test')
  }, 10000)
})

describe('viewing a specific blog entry', () => {
  test('unique identifier property', async () => {
    const blogs = await blogsInDb()

    const idProperty = blogs[0].id

    expect(idProperty).toBeDefined()

  }, 10000)

  test('fetching a single blog', async () => {
    const blogs = await blogsInDb()
    console.log(blogs)
    const blogToView = blogs[0]
    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect(blogToView)
      .expect('Content-Type', /application\/json/)

    const processedBlog = JSON.parse(JSON.stringify(blogToView))

    expect(resultBlog.body).toEqual(processedBlog)

  }, 10000)
})

describe('addition of a new blog', () => {
  let headers

  beforeEach(async () => {

    const newUser = {
      username: 'root',
      name: 'root',
      password: 'password',
    }

    await api
      .post('/api/users')
      .send(newUser)

    const result = await api
      .post('/api/login')
      .send(newUser)

    headers = {
      'Authorization': `bearer ${result.body.token}`
    }
  })
  test('likes property set to 0 if missing', async () => {
    const newBlog = {
      title: 'Nable is good',
      author: 'Pablo Ibarraran',
      url: 'trust me bro'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd[2].likes).toBe(0)
  })

  test('returns 400 if title or url properties are missing', async () => {

    const blogOne = {
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
    }

    const blogTwo = {
      title: 'Async Await Backend',
      author: 'Michael Chan',
      likes: 7,
    }

    await api
      .post('/api/blogs')
      .send(blogOne)
      .set(headers)
      .expect(400)
      .expect({
        'error': 'Blog validation failed: title: title is required to add blog'
      })

    await api
      .post('/api/blogs')
      .set(headers)
      .send(blogTwo)
      .expect(400)
      .expect({
        'error': 'Blog validation failed: url: url is required to add blog'
      })
  })

  test('valid blog can be added', async () => {
    const newBlog = {
      title:'Canonical string reduction',
      author:'Edsger W. Dijkstra',
      url:'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes:12,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()
    const titles = blogsAtEnd.map(blog => blog.title)

    expect(titles).toContain('Canonical string reduction')
    expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)

    //deletes it to prevent errors in other test
    const deleted = blogsAtEnd[2]
    await api
      .delete(`/api/blogs/${deleted.id}`)
      .set(headers)
      .expect(204)
  })

  test('empty blog will not add', async () => {
    const newBlog = {
      author: 'Pablo'
    }

    api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('401 if token is not provided/invalid', async () => {

    const blogsAtStart = await blogsInDb()
    const newBlog = {
      title:'Canonical string reduction',
      author:'Edsger W. Dijkstra',
      url:'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes:12,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })
})

describe('updating a blog', () => {

  test('updating content of a blog', async () => {
    const blogs =  await blogsInDb()
    const blogToUpdate = blogs[0]
    const updatedBlog = {
      title: 'Nable is cracked',
      author: 'Pablo Ibarraran',
      url: 'trust me bro',
      likes: 74,
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)

    const currentBlogs = await blogsInDb()
    expect(currentBlogs[0].title).toBe(updatedBlog.title)
  }, 10000)
})

describe('deleting a blog', () => {
  test('fetching and removing a blog', async () => {
    const blogs = await blogsInDb()
    console.log(blogs)
    const noteToDelete = blogs[0]
    console.log(noteToDelete)

    await api
      .delete(`/api/blogs/${noteToDelete.id}`)
      .expect(204)

    const notesAtEnd = await blogsInDb()
    expect(notesAtEnd).toHaveLength(initialBlogs.length - 1)

    const titles = notesAtEnd.map(blog => blog.title)
    expect(titles).not.toContain(noteToDelete.title)
  })
})


afterAll(() => {
  mongoose.connection.close()
})