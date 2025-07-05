require('express-async-errors')
const blogsRouter = require("./controllers/blog")
const usersRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')
const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

app.use(express.json())


mongoose.set('strictQuery', false)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('dist'))
app.use(middleware.requestLogger)

app.use('/api/login', loginRouter)
app.use('/api/blog', blogsRouter)
app.use('/api/user', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app