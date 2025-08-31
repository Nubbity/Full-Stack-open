import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [statusMessage, setStatusMessage] = useState(null)
  const [showAddBlog, setShowAddBlog] = useState(false)

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setStatusMessage(`Welcome ${user.name}`)
      setTimeout(() => setStatusMessage(null), 3000)
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => setErrorMessage(null), 3000)
    }
  }

  const newBlog = async ({ title, author, url }) => {
    try {
      const newBlog = await blogService.create({ title, author, url })
      setBlogs(blogs.concat(newBlog))
      setStatusMessage(`A new blog ${newBlog.title} by ${newBlog.author} added`)
      setTimeout(() => setStatusMessage(null), 3000)
    } catch (exception) {
      setErrorMessage('Failed to create blog')
      setTimeout(() => setErrorMessage(null), 3000)
    }
  }

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )

  const AddBlogForm = ({ newBlog, setShowAddBlog }) => {
    const handleSubmit = (event) => {
      event.preventDefault()
      const title = event.target.elements.title.value
      const author = event.target.elements.author.value
      const url = event.target.elements.url.value

      newBlog({ title, author, url })
      setShowAddBlog(false)
    }

    return (
      <div>
        <h2>Add a new blog</h2>
        <form onSubmit={handleSubmit}>
          <div>
            title
            <input type="text" name="title" placeholder="title" />
          </div>
          <div>
            author
            <input type="text" name="author" placeholder="author" />
          </div>
          <div>
            url
            <input type="text" name="url" placeholder="url" />
          </div>
          <button type="submit">create</button>
        </form>
        <button onClick={() => setShowAddBlog(false)}>Cancel</button>
      </div>
    )
  }

  const blogView = () => (
    <div>
      <h2>blogs</h2>
      <h5>{user.name} logged in</h5>
      <button onClick={() => {
        window.localStorage.clear()
        setUser(null)
      }}>logout</button>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} blogs={blogs} setBlogs={setBlogs} setStatusMessage={setStatusMessage} loggedInUser={user} />
      )}
      {!showAddBlog && (<button onClick={() => setShowAddBlog(!showAddBlog)}>New Blog</button>)}
      {showAddBlog && <AddBlogForm newBlog={newBlog} setShowAddBlog={setShowAddBlog} />}
    </div>
  )

  useEffect(() => {
    blogService.getAll().then(blogs => {
      const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(sortedBlogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  return (
    <div>
      <h2>Blogs</h2>
      {errorMessage && <h2 className="error">{errorMessage}</h2>}
      {statusMessage && <h2 className="status">{statusMessage}</h2>}
      {user === null ? loginForm() : blogView()}
    </div>
  )
}

export default App