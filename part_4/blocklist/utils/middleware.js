const morgan = require('morgan')
const logger = require('./logger')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
  }
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === "PasswordError") {
    return response.status(400).json({ error: error.message })
  } else if (error.code === 11000) { // MongoDB duplicate key error
    return response.status(400).json({ error: `Non-uniq username` })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  }
    return response.status(500).json({ error: error.message });
  }

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}