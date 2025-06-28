const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('most blogs', () => {
  test('returns null for empty list', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })

  test('returns the author with the most blogs', () => {
    const blogs = [
      {
        _id: '1',
        title: 'Blog 1',
        author: 'Robert C. Martin',
        url: 'http://example.com/1',
        likes: 5,
      },
      {
        _id: '2',
        title: 'Blog 2',
        author: 'Robert C. Martin',
        url: 'http://example.com/2',
        likes: 3,
      },
      {
        _id: '3',
        title: 'Blog 3',
        author: 'Robert C. Martin',
        url: 'http://example.com/3',
        likes: 7,
      },
      {
        _id: '4',
        title: 'Blog 4',
        author: 'Martin Fowler',
        url: 'http://example.com/4',
        likes: 4,
      }
    ]

    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      blogs: 3,
    })
  })
})
describe('most likes', () => {
  test('returns null for empty list', () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, null)
  })

  test('returns author with most total likes', () => {
    const blogs = [
      {
        _id: '1',
        title: 'Blog 1',
        author: 'Edsger W. Dijkstra',
        url: 'http://example.com/1',
        likes: 5,
      },
      {
        _id: '2',
        title: 'Blog 2',
        author: 'Robert C. Martin',
        url: 'http://example.com/2',
        likes: 3,
      },
      {
        _id: '3',
        title: 'Blog 3',
        author: 'Edsger W. Dijkstra',
        url: 'http://example.com/3',
        likes: 12,
      },
    ]

    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    })
  })
})