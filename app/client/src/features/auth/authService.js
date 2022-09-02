import { privateReq, publicReq } from '../../utils/axiosMethod'


// Register user
const register = async (userData) => {
  const response = await publicReq.post('/auth/register', userData)
          return response.data 
}

// Login user
const login = async (userData) => {
  const response = await publicReq.post('/auth/login', userData)
    return response.data
}


// Checkout user
const checkUser = async () => {
  const response = await privateReq.get('/current')
    return response.data

}

// Logout user
const logout = async (userId) => {
  const response = await privateReq.post('/auth/logout', {userId})
  console.log(response)
  return response.data
}

//Update user 
const updateUser = async (userId, userData) => {
  console.log(userId)
  const response = await privateReq.put("/user/"+ userId, userData)

  return response.data
}

const deleteAccount = async (userId) => {
  const response = await privateReq.delete("/user/"+ userId)

  return response.data
}



const authService = {
  register,
  logout,
  login,
  checkUser,
  updateUser,
  deleteAccount,
}

export default authService
