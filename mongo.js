/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
require('dotenv').config()
const mongoose = require('mongoose')

if(process.argv.length < 3){
  console.log('please provide password')
  process.exit(1)
}

const password = process.env.MONGODB_PASSWORD



const url = process.env.MONGODB_URI
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected')

    const blogEntry = new Blog({
      title: 'Example',
      author: 'example author',
      url: 'example url',
      likes: 3
    })

    return blogEntry.save()
  })
  .then(() => {
    console.log('note saved!')
    return mongoose.connection.close()
  })
  .catch((err) => console.log(err))
