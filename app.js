const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users') 
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

require('dotenv').config({ path: '.env' })
app.use(middleware.tokenExtractor)
app.use(cors())
app.use(express.json()) 
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter) 

module.exports = app