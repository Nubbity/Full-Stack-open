const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  if (!password || password.length < 3) {
    const error = new Error("Password must be at least 3 characters long");
    error.name = "PasswordError";
    throw error;
  }
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response, next) => {
  const users = await User.find({}).populate('blogs')
  response.json(users)
})

module.exports = usersRouter