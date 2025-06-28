const _ = require('lodash')

const dummy = (blogs) => 1

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  return blogs.reduce((fav, blog) => (blog.likes > fav.likes ? blog : fav), blogs[0])
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const grouped = _.groupBy(blogs, 'author')
  const blogCounts = _.map(grouped, (posts, author) => ({
    author,
    blogs: posts.length,
  }))
  return _.maxBy(blogCounts, 'blogs')
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const grouped = _.groupBy(blogs, 'author')
  const likesByAuthor = _.map(grouped, (posts, author) => ({
    author,
    likes: _.sumBy(posts, 'likes'),
  }))
  return _.maxBy(likesByAuthor, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}