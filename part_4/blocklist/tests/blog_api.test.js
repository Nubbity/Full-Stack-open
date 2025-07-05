const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')



const initialBlogs = [
    {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/"
    },
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    },
    {
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10
    },
    {
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0
    },
    {
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2
    }  
  ]
const blogWithLikes =     {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7
  }
beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

describe('Integration tests', () => {
    test('Blogs are returned as json', async () => {
        const response = await api
        .get('/api/blog')
        .expect(200)
        .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.length,
                            2,
                            'Blog count does not match');
    })

    test('We use id and not id_', async () => {
        const response = await api
        .post('/api/blog')
        .send(initialBlogs[1])
        .expect(201)
        .expect('Content-Type', /application\/json/)
        const blog = response.body
        assert.strictEqual(blog.id !== undefined,true, 'id should be defined')
        assert.strictEqual(blog._id, undefined, '_id should be undefined')
        

    })


    test('Adding new entries works', async () => {
        const InitialResponse = await api
            .get('/api/blog')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const nBlogs = InitialResponse.body.length

        const postResponse = await api
        .post('/api/blog')
        .send(initialBlogs[1])
        .expect(201)
        .expect('Content-Type', /application\/json/)
        const returnedBlog = postResponse.body
        const { id, ...blogWithoutId } = returnedBlog //the new post has unique id that we are not able to compare

        const finalResponse = await api
        .get('/api/blog')
        .expect(200)
        .expect('Content-Type', /application\/json/)
        assert.strictEqual(nBlogs +1, finalResponse.body.length, 'new post should have been added')
        assert.deepStrictEqual(initialBlogs[1], blogWithoutId, "Blogs were not a match")
    })


    test('Likes default to 0', async () => {
        const response = await api
        .post('/api/blog')
        .send(initialBlogs[0])//test case without likes
        .expect(201)
        const blog = response.body
        assert.strictEqual(blog.likes, 0, 'like should default to 0')
    
        

    })

    test('Missing title or URL returns 400', async () => {
        const response1 = await api
        .post('/api/blog')
        .send(initialBlogs[2])
        .expect(400)

        const response2 = await api
        .post('/api/blog')
        .send(initialBlogs[3])
        .expect(400)

    })

    test("Delete object", async () =>{
        const response1 = await api
        .post('/api/blog')
        .send(initialBlogs[0])
        const id = response1.body.id

        const response2 = await api
        .delete('/api/blog/'+id)
        .expect(200)
    })

    test("Updating blogs", async () =>{
        const response1 = await api
        .post('/api/blog')
        .send(initialBlogs[1])
        .expect(201)
        const id = response1.body.id
        
        const response2 = await api
        .put('/api/blog/'+id)
        .send(blogWithLikes)
        .expect(200)
        const updatedLikes = response2.body.likes
        assert.strictEqual(updatedLikes, blogWithLikes.likes, 'Likes should be updated')

    })
})


after(async () => {
    await mongoose.connection.close()
  })