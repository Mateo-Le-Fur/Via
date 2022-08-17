
import axios from 'axios'
const API_URL = '/api/auth/'

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL + 'register', userData)
          return response.data.user 
}

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData)
    return response.data.user
}

// Login user
const checkUser = async () => {
  const response = await axios.get(API_URL + 'current')
    return response.data.user
}

// Logout user
const logout = async () => {
  const response = await axios.post(API_URL + 'logout')
  return response.data
}

const authService = {
  register,
  logout,
  login,
  checkUser,
}

export default authService
