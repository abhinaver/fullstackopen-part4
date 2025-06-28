require('dotenv').config({ path: '.env.test' })

const helper = require('./test_helper')
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
test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'New Blog Post',
    author: 'New Author',
    url: 'http://newblog.com',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await api.get('/api/blogs')
  expect(blogsAtEnd.body).toHaveLength(initialBlogs.length + 1)

  const titles = blogsAtEnd.body.map(b => b.title)
  expect(titles).toContain('New Blog Post')
})

test('if likes property is missing, it defaults to 0', async () => {
  const newBlog = {
    title: 'Test blog with no likes',
    author: 'Tester',
    url: 'http://testnolikes.com'
    // no likes field
  }

  const response = await api
    .post('/api/blogs')
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

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'No URL',
    author: 'No URL Author',
    likes: 7,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('a blog can be deleted', async () => {
  const newBlog = {
    title: 'Blog to delete',
    author: 'Someone',
    url: 'http://delete.com',
    likes: 1,
  }

  const saved = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)

  const blogsAtStart = await Blog.find({})
  await api
    .delete(`/api/blogs/${saved.body.id}`)
    .expect(204)

  const blogsAtEnd = await Blog.find({})
  expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
})