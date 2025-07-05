const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response, next) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id:1})
    response.json(blogs)

  })

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}
blogsRouter.post('/', async (request, response, next) => {
  const {title, author, url,likes} = request.body
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const users = await User.findById(decodedToken.id)  
  const user = users[0]
  const blog = new Blog({title, author, user: user.id, url,likes})
  const savedblog = await blog.save()
  user.blogs = user.blogs.concat(savedblog._id)
  await user.save()
  response.status(201).json(savedblog)
  })

  blogsRouter.delete('/:id', async (request, response, next) => {
    const blogId = request.params.id
    const deleteBlog = await Blog.findByIdAndDelete(blogId)
    response.status(200).json(deleteBlog)
  })

  blogsRouter.put('/:id', async (request, response, next) => {
    const blogId = request.params.id
    const updatedBlog = await Blog.findByIdAndUpdate(blogId, request.body, { new: true })
    response.status(200).json(updatedBlog)
  })


  module.exports = blogsRouter