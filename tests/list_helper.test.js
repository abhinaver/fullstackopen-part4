const { describe, test } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const listWithMultipleBlogs = [
  {
    _id: '1',
    title: 'First Blog',
    author: 'Author A',
    url: 'http://a.com',
    likes: 3,
    __v: 0,
  },
  {
    _id: '2',
    title: 'Second Blog',
    author: 'Author B',
    url: 'http://b.com',
    likes: 7,
    __v: 0,
  },
  {
    _id: '3',
    title: 'Third Blog',
    author: 'Author C',
    url: 'http://c.com',
    likes: 5,
    __v: 0,
  },
]

describe('favorite blog', () => {
  test('returns null for empty list', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })

  test('returns the only blog when one blog is present', () => {
    const blog = listWithMultipleBlogs[1]
    const result = listHelper.favoriteBlog([blog])
    assert.deepStrictEqual(result, blog)
  })

  test('returns the blog with most likes', () => {
    const result = listHelper.favoriteBlog(listWithMultipleBlogs)
    assert.deepStrictEqual(result, listWithMultipleBlogs[1]) // Second Blog with 7 likes
  })
})