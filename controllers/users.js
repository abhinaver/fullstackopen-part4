const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'username and password required' })
  }

  if (username.length < 3 || password.length < 3) {
    return res.status(400).json({ error: 'username and password must be at least 3 characters long' })
  }

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return res.status(400).json({ error: 'username must be unique' })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
  res.status(201).json(savedUser)
})

// ✅ Get all users with their blogs populated
usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
    id: 1
  })

  res.json(users)
})

// ✅ Temporary route to delete all users
usersRouter.delete('/reset-users', async (req, res) => {
  await User.deleteMany({})
  res.status(204).end()
})

module.exports = usersRouter