import { privateReq, publicReq } from '../../utils/axiosMethod'


// Register user
const register = async (userData) => {
  const response = await publicReq.post('/auth/register', userData)
          return response.data.user 
}

// Login user
const login = async (userData) => {
  const response = await publicReq.post('/auth/login', userData)
    return response.data.user
}


// Login user
const checkUser = async () => {
  const response = await privateReq.get('/auth/current')
    return response.data.user

}

// Logout user
const logout = async () => {
  const response = await privateReq.post('/auth/logout')
  return response.data
}

const authService = {
  register,
  logout,
  login,
  checkUser,
}

export default authService
