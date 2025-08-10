import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

test('renders content', () => {
    const blog = {
        title: 'Test Title',
        author: 'Test Author',
        url: 'http://testurl.com',
        likes: 69,
        user: { username: 'testuser' },
      }

    const loggedInUser = { username: 'testuser' }
    const { container } = render(
      <Blog blog={blog} setBlogs={() => {}} blogs={[]} loggedInUser={loggedInUser} />
    )

    const summaryDiv = container.querySelector('.blog-summary')
    expect(summaryDiv).toHaveTextContent('Test Title')
    expect(summaryDiv).toHaveTextContent('Test Author')

    const detailsDiv = container.querySelector('.blog-details')
    expect(detailsDiv).toBeNull()

})

test('likes and url - button control', async () => {
    const blog = {
        title: 'Test Title',
        author: 'Test Author',
        url: 'http://testurl.com',
        likes: 69,
        user: { username: 'testuser' },
      }

    const loggedInUser = { username: 'testuser' }
    const { container } = render(
      <Blog blog={blog} setBlogs={() => {}} blogs={[]} loggedInUser={loggedInUser} />
    )

    const user = userEvent.setup()
    const viewButton = screen.getByText('View')
    await user.click(viewButton)
    const detailsDiv = container.querySelector('.blog-details')
    expect(detailsDiv).toHaveTextContent('http://testurl.com')
    expect(detailsDiv).toHaveTextContent('likes: 69')
})

test('Multiple like clicks', async() => {
    const blog = {
        title: 'Test Title',
        author: 'Test Author',
        url: 'http://testurl.com',
        likes: 69,
        user: { username: 'testuser' },
      }
    const mockHandler = vi.fn()
    const loggedInUser = { username: 'testuser' }
    const { container } = render(
      <Blog blog={blog} setBlogs={() => {}} blogs={[]} loggedInUser={loggedInUser} addLike={mockHandler} />
    )


    const user = userEvent.setup()
    const viewButton = screen.getByText('View')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockHandler).toHaveBeenCalledTimes(2)
})

test('New blog form', async() => {
    const blog = {
        title: 'Test Title',
        author: 'Test Author',
        url: 'http://testurl.com',
        likes: 69,
        user: { username: 'testuser' },
      }
    const mockHandler = vi.fn()
    const loggedInUser = { username: 'testuser' }
    const { container } = render(
      <Blog blog={blog} setBlogs={() => {}} blogs={[]} loggedInUser={loggedInUser} addLike={mockHandler} />
    )


    const user = userEvent.setup()
    const viewButton = screen.getByText('View')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockHandler).toHaveBeenCalledTimes(2)
})