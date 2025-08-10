import React from "react"

const AddBlogForm = ({ addBlog, setShowAddBlog }) => {
  const handleSubmit = (event) => {
    event.preventDefault()
    const author = event.target.elements.author.value
    const url = event.target.elements.url.value

    addBlog({ title, author, url }) /
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

export default AddBlogForm