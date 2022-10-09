require('dotenv').config()
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const tokenExtractor = require('./middleware/tokenExtractor')


app.use(tokenExtractor)
app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.get('/', (request, response) => {
  response.send('<h1>BLOG LIST APP</h1>').status(200).end()
})



app.use((error, request, response, next) => {

  if(error.name === 'CastError'){
    response.status(400).send({ error: 'malformatted ID, must be same as in the database' })
  } else if(error.name === 'ValidationError'){
    response.status(400).json({ error: error.message })
  } else if(error.name === 'JsonWebTokenError'){
    response.status(401).json({ error: 'Unathorized, invalid token' })
  } else if(error.name === 'TokenExpiredError'){
    response.status(401).json({ error: 'Token Expired' })
  }
  next(error)
})

// eslint-disable-next-line no-unused-vars
app.use((error, request, response, next) => {
  response.status(400).send({ error: 'unknown endpoint' })
})

module.exports = app