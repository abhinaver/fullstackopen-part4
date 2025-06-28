const http = require('http')
const app = require('./app')
const mongoose = require('mongoose')
require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
})

const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl)

const server = http.createServer(app)
server.listen(3003, () => {
  console.log('Server running on port 3003')
})