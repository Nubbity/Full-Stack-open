require('dotenv').config()

const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI

const PORT = process.env.PORT || 3003

console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('MONGODB_URI:', MONGODB_URI)

module.exports = { MONGODB_URI, PORT }