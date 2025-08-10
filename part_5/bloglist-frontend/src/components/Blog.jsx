import { useState } from 'react'
import PropTypes from 'prop-types'
import blogService from '../services/blogs'

const Blog = ({ blog, setBlogs, blogs, loggedInUser, addLike }) => {
  const [showBlog, setShowBlog] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleLike = async () => {
    if (addLike) {
      addLike(blog.id)}
    else {
      const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user._id }
      try {
        const response = await blogService.update(blog.id, updatedBlog)
        setBlogs(blogs.map(b => (b.id !== blog.id ? b : response)))
      } catch (exception) {
        console.error('Error updating blog:', exception.response?.data || exception.message)
      }
    }
  }

  const removeBlog = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
      } catch (error) {
        console.error('Error removing blog:', error)
      }
    }
  }

  return (
    <div style={blogStyle} className="blog">
      <div className="blog-summary">
        {blog.title} {blog.author}{' '}
        {!showBlog && <button onClick={() => setShowBlog(true)}>View</button>}
      </div>
      {showBlog && (
        <div className="blog-details">
          <button onClick={() => setShowBlog(false)}>Hide</button>
          <p>{blog.url}</p>
          <p>
            likes: {blog.likes}{' '}
            <button onClick={handleLike}>like</button>
          </p>
          <p>added by {blog.user.username}</p>
          {loggedInUser.username === blog.user.username && (
            <button onClick={removeBlog}>Remove</button>
          )}
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  setBlogs: PropTypes.func.isRequired,
  blogs: PropTypes.array.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  addLike: PropTypes.func,
}

export default Blog