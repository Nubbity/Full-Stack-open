const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')
const { testUsers } = require('../utils/user_helper')
require('../utils/user_helper')

describe('User Validation tests', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        let userObject = new User(testUsers[3])//fro duplicate test
        await userObject.save()
      })


    test('Adding new user', async () => {
        const response = await api
        .post('/api/user')
        .send(testUsers[0])
        .expect(201)
        .expect('Content-Type', /application\/json/)
    })

    test('Invalid username', async () => {
        const response = await api
        .post('/api/user')
        .send(testUsers[1])
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })
    test('Invalid Password', async () => {
        const response = await api
        .post('/api/user')
        .send(testUsers[2])
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })
    test('Duplicate username', async () => {
        const response = await api
        .post('/api/user')
        .send(testUsers[3])
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })
})


after(async () => {
    await mongoose.connection.close()
  })