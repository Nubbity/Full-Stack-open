const { test, expect, beforeEach, describe } = require('@playwright/test')

const name = 'Massa Mallikas'
const username = 'UserMassa'
const password = 'sal4inen'

describe('Blog app', () => {

  beforeEach(async ({ page, request }) => {

    await request.post('http://localhost:3003/api/controllers/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: name,
        username: username,
        password: password
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByText('login')).toBeVisible()
  })


describe('Login', () => {

    test('succeeds with correct credentials', async ({ page }) => {
      await page.locator('input[name="Username"]').fill(username)
      await page.locator('input[name="Password"]').fill(password)
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText(`${name} logged in`)).toBeVisible()

    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.locator('input[name="Username"]').fill(username)
      await page.locator('input[name="Password"]').fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Wrong credentials')).toBeVisible()
    
    })
  })

})


describe('When logged in', () => {
  beforeEach(async ({ page, request  }) => {
    await request.post('http://localhost:3003/api/controllers/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: name,
        username: username,
        password: password
      }
    })
    await page.goto('http://localhost:5173')
    await page.locator('input[name="Username"]').fill(username)
    await page.locator('input[name="Password"]').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
    console.log('logged in')
  })
  
  test('a new blog can be created', async ({ page }) => {
    await page.getByRole('button', { name: 'New blog' }).click()
    await page.getByRole('textbox', { name: 'title' }).fill('Test Blog')
    await page.getByRole('textbox', { name: 'author' }).fill('Test Author')
    await page.getByRole('textbox', { name: 'url' }).fill('http://testblog.com')
    await page.getByRole('button', { name: 'Create' }).click()
    await expect(page.getByText('A new blog')).toBeVisible()
    await expect(page.getByText('A new blog Test Blog by Test Author added', { exact: true })).toBeVisible()
    await page.getByRole('button', { name: 'View' }).last().click()
    await expect(page.getByText('http://testblog.com')).toBeVisible()
  })

  test('Blog can be liked', async ({ page }) => {
    await page.getByRole('button', { name: 'View' }).last().click()
    const likesText = await page.getByText('Likes').textContent()
    const initialLikes = parseInt(likesText.split(':')[1].trim(), 10)
    await page.getByRole('button', { name: 'Like' }).click()
    await page.waitForTimeout(100)
    const updatedLikesText = await page.getByText('Likes').textContent()
    const newLikes = parseInt(updatedLikesText.split(':')[1].trim(), 10)

    expect(newLikes).toBe(initialLikes + 1)
  })

   test('Blog can be removed', async ({ page }) => {
    await page.getByRole('button', { name: 'New blog' }).click()
    await page.getByRole('textbox', { name: 'title' }).fill('Test Blog')
    await page.getByRole('textbox', { name: 'author' }).fill('Test Author')
    await page.getByRole('textbox', { name: 'url' }).fill('http://testblog.com')
    await page.getByRole('button', { name: 'Create' }).click()
    await page.reload()
    await page.getByRole('button', { name: 'View' }).last().click()
    page.on('dialog', async dialog => {
        expect(dialog.type()).toBe('confirm')
        await dialog.accept()
    })
    await page.getByRole('button', { name: 'Remove' }).last().click()
    await expect(page.getByText('Blog Test Blog removed successfully')).toBeVisible()
  })

  test('Only user can remove their blog', async ({ page, request }) => {
    await page.getByRole('button', { name: 'New blog' }).click()
    await page.getByRole('textbox', { name: 'title' }).fill('Test Blog')
    await page.getByRole('textbox', { name: 'author' }).fill('Test Author')
    await page.getByRole('textbox', { name: 'url' }).fill('http://testblog.com')
    await page.getByRole('button', { name: 'Create' }).click()
    await page.reload()
    await page.getByRole('button', { name: 'Logout' }).click()

    const newName = name + '2'
    const newUsername = username + '2'
    const newPassword = password+ '2'

    await request.post('http://localhost:3003/api/users', {
      data: {
        name: newName,
        username: newUsername,
        password: newPassword
      }
    })
    await page.locator('input[name="Username"]').fill(newUsername)
    await page.locator('input[name="Password"]').fill(newPassword)
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByRole('button', { name: 'View' }).last().click()
    const removeButtons = await page.getByRole('button', { name: 'Remove' }).count()
    expect(removeButtons).toBe(0)
  })

  test('Blogs are ordered by likes', async ({ page, request }) => {
      const viewButtons = await page.getByRole('button', { name: 'View' }).all();
      for (const button of viewButtons) {
        await button.click();
      }
      const likeButtonLocator = await page.getByRole('button', { name: 'Like' }).all();
      const allLikes = [];
      for (let i = 0; i < likeButtonLocator.length; i++) {
        const likesText = await page.getByText('Likes').nth(i).textContent();
        const initialLikes = parseInt(likesText.split(':')[1].trim(), 10);
        allLikes.push(initialLikes);
      }
      const sortedLikes = [...allLikes].sort((a, b) => b - a);
      expect(allLikes).toEqual(sortedLikes);
  })
})