import { publicReq, privateReq } from '../../utils/axiosMethod'

// Create new activity
const createActivity = async (activityData) => {

  const response = await privateReq.post('/activities', activityData)

  return response.data
}

// Get activities 
const getActivities = async () => {

  const response = await publicReq.get('/activities')
  return response.data
}

// Get activity by Id
const getActivity = async (activityId) => {
  const response = await publicReq.get(`/activities/${activityId}`)

  return response.data
}

//Update Activity 
const updateActivity = async (activityId, activityData) => {
  console.log(activityId)
  const response = await privateReq.put("/activities/"+ activityId, activityData)

  return response.data
}

// Delete Actvity 
const deleteActivity = async (activityId) => {

  const response = await privateReq.delete("/activities/" + activityId)

  if (response.status === 200 ){
    return activityId
  }
}


const recipeService = {
  createActivity,
  getActivities,
  getActivity,
  updateActivity,
  deleteActivity,
}

export default recipeService