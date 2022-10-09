const bcrypt = require('bcrypt')
const User = require('../models/user')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const usersInDb = require('./test_helper').usersInDb
const bycrypt = require('bcrypt')


beforeEach(async () => {
  // deletes all users in database
  await User.deleteMany({})
  console.log('cleared')

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'TheGlyph', name: 'Nabeel Ahmad', passwordHash })

  await user.save()
}, 100000)

describe('when there is only 1 user in the database', () => {

  test('creating a new user is sucessful with new username', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'TheGlyph',
      name: 'Pablo Ibarraran',
      password: await bycrypt.hash('sekret', 10)
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    console.log(usersAtEnd)
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain(newUser.username)

  })

  test('username must be unique', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'TheGlyph',
      name: 'Nabille',
      password: 'JackWilder7'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})