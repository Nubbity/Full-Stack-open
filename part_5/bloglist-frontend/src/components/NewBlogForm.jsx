import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import NewBlogForm from './components/NewBlogForm'
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
    console.log('Logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password,
      })
      console.log('Login successful:', user)
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setStatusMessage(`Welcome ${user.name}`)
      setTimeout(() => {
        setStatusMessage(null)
      }, 3000)
    } catch (exception) {
      console.error('Login failed:', exception.response?.data || exception.message)
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  const createBlog = async (newBlog) => {
    try {
      const savedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(savedBlog))
      setStatusMessage(`A new blog ${savedBlog.title} by ${savedBlog.author} added`)
      setTimeout(() => {
        setStatusMessage(null)
      }, 3000)
      setShowAddBlog(false) // Hide the form after successful submission
    } catch (exception) {
      console.error('Error creating blog:', exception.response?.data || exception.message)
      setErrorMessage('Failed to create blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
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

  const blogView = () => (
    <div>
      <h2>blogs</h2>
      <h5>{user.name} logged in</h5>
      <button onClick={() => {
        window.localStorage.clear()
        setUser(null)
      }}>logout</button>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      {!showAddBlog && (
        <button onClick={() => setShowAddBlog(true)}>New Blog</button>
      )}
      {showAddBlog && (
        <NewBlogForm
          createBlog={createBlog}
          cancel={() => setShowAddBlog(false)}
        />
      )}
    </div>
  )

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    console.log('Logged user from localStorage:', loggedUserJSON)
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