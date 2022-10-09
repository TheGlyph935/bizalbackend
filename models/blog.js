/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const config = require('../utils/config')
const mongoose = require('mongoose')

const url = config.MONGODB_URI

console.log(`connecting to ${url}`)

mongoose.connect(url)
  .then(result => {
    console.log('Connected to MONGODB sucessfully')
  })
  .catch(error => console.log(`Unable to connect to MONGODB database: ${error.message}`))

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'title is required to add blog']
  },
  author: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: [true, 'url is required to add blog']
  },
  likes: {
    type: Number
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)