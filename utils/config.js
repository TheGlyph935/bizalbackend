/* eslint-disable no-undef */
require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.MONGODB_TEST_URI
  : process.env.MONGODB_URI

const MONGODB_USERS_URI = process.env.MONGODB_USERS_URI

const SECRET = process.env.SECRET

module.exports = {
  PORT,
  MONGODB_URI,
  MONGODB_USERS_URI,
  SECRET
}