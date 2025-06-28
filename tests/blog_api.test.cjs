require('dotenv').config({ path: '.env.test' })
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

let token

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_MONGODB_URI)
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  // Create test user
  const passwordHash = await bcrypt.hash('password123', 10)
  const user = new User({ username: 'testuser', name: 'Test User', passwordHash })
  await user.save()

  // Log in and get token
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'testuser', password: 'password123' })

  token = loginResponse.body.token

  // Add blogs with user reference
  const blogObjects = helper.initialBlogs.map(blog => new Blog({ ...blog, user: user._id }))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blog posts have id field defined, not _id', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
  expect(response.body[0]._id).toBeUndefined()
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'New Blog Post',
    author: 'New Author',
    url: 'http://newblog.com',
    likes: 5,
  }

  await api.post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  expect(titles).toContain('New Blog Post')
})

test('if likes property is missing, it defaults to 0', async () => {
  const newBlog = {
    title: 'No Likes Blog',
    author: 'No Liker',
    url: 'http://nolikes.com',
  }

  const response = await api.post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  expect(response.body.likes).toBe(0)
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'No Title',
    url: 'http://notitle.com',
    likes: 5,
  }

  await api.post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'No URL',
    author: 'Missing Link',
    likes: 3,
  }

  await api.post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('a blog can be deleted', async () => {
  const newBlog = {
    title: 'To Delete',
    author: 'Deleter',
    url: 'http://delete.com',
    likes: 1,
  }

  const saved = await api.post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  await api.delete(`/api/blogs/${saved.body.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('a blog\'s likes can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const response = await api.put(`/api/blogs/${blogToUpdate.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ likes: blogToUpdate.likes + 10 })
    .expect(200)

  expect(response.body.likes).toBe(blogToUpdate.likes + 10)
})

afterAll(async () => {
  await mongoose.connection.close()
})
