require('dotenv').config({ path: '.env.test' })

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'First blog',
    author: 'Author One',
    url: 'http://first.com',
    likes: 10,
  },
  {
    title: 'Second blog',
    author: 'Author Two',
    url: 'http://second.com',
    likes: 20,
  }
]

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_MONGODB_URI)
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blog posts have id field defined, not _id', async () => {
  const response = await api.get('/api/blogs')

  const blog = response.body[0]
  expect(blog.id).toBeDefined()
  expect(blog._id).toBeUndefined()
})

afterAll(async () => {
  await mongoose.connection.close()
})