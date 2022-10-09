/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
require('./utils/config')
const mongoose = require('mongoose')
const blogs = require('./blogsExamples').blogs

const url = process.env.MONGODB_TEST_URI
const password = process.env.MONGODB_PASSWORD

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

blogs.forEach(blog => {
  mongoose
    .connect(url)
    .then(() => {
      console.log('Connected to MONGODB')

      const blogEntry = new Blog({
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes
      })

      return blogEntry.save()
    })
    .then(() => {
      console.log('saved')
      return mongoose.connection.close()
    })
    .catch(error => console.log(error))
})
