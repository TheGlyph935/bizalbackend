/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const blogsRouter = require('express').Router()
const { response } = require('express')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {

  const blog = await Blog.findById(request.params.id)

  if(blog){
    response.json(blog)
  } else{
    response.status(404).send({ error: 'Unable to find blog with such ID' })
  }
})

// const getTokenFrom = (request) => {
//   const authorization = request.get('authorization')

//   if(authorization && authorization.toLowerCase().startsWith('bearer ')){
//     return authorization.substring(7) //removes bearer from token and returns token only
//   } else{
//     return null
//   }
// }

blogsRouter.post('/', async (request, response) => {

  const token = request.token

  console.log(token)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if(!(decodedToken.id)){
    return response.status(401).json({ error: 'Invalid Token or Missing ' })
  }

  const user = await User.findById(decodedToken.id)

  let blog = new Blog(request.body)
  // sets likes to 0 if they aren't specified
  if(request.body.likes === undefined){
    const blogTemplate = {
      title: `${request.body.title}`,
      author: `${request.body.author}`,
      url: `${request.body.url}`,
      likes: 0,
      user: user._id
    }

    blog = new Blog(blogTemplate)
  } else{
    Object.assign(blog, { user: user._id })
  }

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const token = request.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if(!(decodedToken.id)){
    response.status(401).json({ error: 'Invalid Token or Missing' })
  }
  const blog = await Blog.findById(request.params.id)
  console.log(blog.user.toString() === decodedToken.id)


  if(decodedToken.id === blog.user.toString()){
    console.log('sucess, blog deleted')
  } else{
    response.status(401).json({ error: 'Blog can only be deleted by user who created it, and must be logged in.' })
  }


  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  await Blog.findByIdAndUpdate(request.params.id, request.body)
  response.status(200).json(request.body)
})

module.exports = blogsRouter
