const totalLikes = (blogs) => {
    let sum = 0
    blogs.forEach(blog => {
        sum+=blog.likes
    });
    return sum
  }

const favoriteBlog = (blogs) => {
    let maxLikes = 0
    let bestBlog = null
    blogs.forEach(blog =>{
        if(blog.likes > maxLikes){
            bestBlog = {...blog}
            maxLikes =blog.likes
        }
    })
    return bestBlog
}


const mostBlogs = (blogs) => {
    let authors = new Map()

    blogs.forEach(blog => {
        if(authors.has(blog.author)){
            let n = authors.get(blog.author)
            authors.set(blog.author, n+1)
        }
        else{
            authors.set(blog.author, 1)
        }
    })


    let maxPosts = 0
    let topAuthor = null
    authors.forEach((posts, author) => {
        if (posts > maxPosts) {
          maxPosts = posts
          topAuthor = author
        }
      })
    return { author: topAuthor, posts: maxPosts }
}

const mostLikes = (blogs) => {
    let authors = new Map()

    blogs.forEach(blog => {
        if(authors.has(blog.author)){
            let n = authors.get(blog.author)
            authors.set(blog.author, n+blog.likes)
        }
        else{
            authors.set(blog.author, blog.likes)
        }
    })


    let maxLikes = 0
    let topAuthor = null
    authors.forEach((likes, author) => {
        if (likes > maxLikes) {
          maxLikes = likes
          topAuthor = author
        }
      })
    return { author: topAuthor, likes: maxLikes }
}

  
  module.exports = {
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }
