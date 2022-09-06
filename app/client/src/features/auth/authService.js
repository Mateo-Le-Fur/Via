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
  const response = await privateReq.post('/auth/logout', { userId })
  return response.data
}

//Update user 
const updateUser = async (userId, userData) => {
  const response = await privateReq.put("/user/" + userId, userData)
  return response.data
}

const deleteAccount = async (userId) => {
  const response = await privateReq.delete("/user/" + userId)
  return response.data
}


// Chat
// get messages 
const getMessages = async (currentUserId) => {
  const res = await privateReq.get(`/user/${currentUserId}/message/`)
  return res.data
}

// add message
const addMessage = async (cuurentUserId, recipientId, message) => {
  const res = await privateReq.post(`/user/${cuurentUserId}/message/`, { recipientId, message })
  return res.data.message
}


const authService = {
  register,
  logout,
  login,
  checkUser,
  updateUser,
  deleteAccount,
  getMessages,
  addMessage
}

export default authService
