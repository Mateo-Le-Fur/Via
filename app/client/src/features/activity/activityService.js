import { publicReq, privateReq } from '../../utils/axiosMethod'

// Create new activity
const createActivity = async (activityData, userId) => {

  const response = await privateReq.post(`/user/${userId}/activity`, activityData)

  return response.data
}

// Get activities 
const getActivities = async () => {

  const response = await publicReq.get('/activity')
  return response.data
}

// Get activity by Id
const getActivity = async (activityId) => {
  const response = await publicReq.get(`/activity/${activityId}`)

  return response.data
}

//Update Activity 
const updateActivity = async (activityId, activityData, userId) => {
  console.log(activityId)
  const response = await privateReq.put(`user/${userId}/activity/${activityId}`, activityData)

  return response.data
}

// Delete Actvity 
const deleteActivity = async (activityId, userId) => {
   await privateReq.delete(`/user/${userId}/activity/${activityId}`)
    return activityId
}

// get bookmarks
const getBookmarks = async (userId) => {
  const res = await privateReq.get(`/user/${userId}/bookmark/`)
   const bookmarks = res.data.activity.map(activity => activity.id)
   return bookmarks
}

// add bookmark
const createBookmark = async (activityId, userId) => {
  await privateReq.post(`/user/${userId}/bookmark/`)
   return activityId
}

// delete bookmark
const deleteBookmark = async (bookmarkId, userId) => {
 await privateReq.delete(`/user/${userId}/bookmark/${bookmarkId}`)
 return bookmarkId
}

const recipeService = {
  createActivity,
  getActivities,
  getActivity,
  updateActivity,
  deleteActivity,
  getBookmarks,
  createBookmark,
  deleteBookmark,
}

export default recipeService