import axios from 'axios'
const baseUrl = '/api/login'

const login = async credentials => {
  // Sends a POST request to the login endpoint with the provided credentials
  console.log('POSTing in with credentials:', credentials)
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }