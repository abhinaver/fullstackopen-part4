const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

require('dotenv').config({ path: '.env.test' })

jest.setTimeout(30000) 

beforeAll(async () => {
  const mongoUri = process.env.TEST_MONGODB_URI
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
})

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 1)
  const user = new User({ username: 'root', passwordHash })
  await user.save()
})

test('fails with status 400 if username is less than 3 chars', async () => {
  const newUser = {
    username: 'ab',
    name: 'Short Username',
    password: 'password123',
  }

  const result = await api.post('/api/users').send(newUser).expect(400)
  expect(result.body.error).toContain('at least 3 characters')
})

test('fails with status 400 if password is missing', async () => {
  const newUser = {
    username: 'validuser',
    name: 'No Password',
  }

  const result = await api.post('/api/users').send(newUser).expect(400)
  expect(result.body.error).toContain('required')
})

test('fails with status 400 if username is already taken', async () => {
  const newUser = {
    username: 'root',
    name: 'Duplicate User',
    password: 'password123',
  }

  const result = await api.post('/api/users').send(newUser).expect(400)
  expect(result.body.error).toContain('unique')
})

afterAll(async () => {
  await mongoose.connection.close()
})