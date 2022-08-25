import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import activityService from "./activityService"

const initialState = {
  activities: [],
  activity: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
}

export const createActivity = createAsyncThunk(
  'activity/create',
 
  async (activityData, thunkAPI) => {
    console.log(activityData)
    try {
      return await activityService.createActivity(activityData)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const getActivity = createAsyncThunk(
  'activity/get',
  async (activityId, thunkAPI) => {
    try {
      return await activityService.getActivity(activityId)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const getActivities = createAsyncThunk(
  'activity/getAll',
  async (_, thunkAPI) => {
    try {
      return await activityService.getActivities()
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
)


export const updateActivity = createAsyncThunk(
  'activity/update',
  async (data, thunkAPI) => {
    const {activityId, activityData} = data
    console.log(data)
    try {
      return await activityService.updateActivity(activityId,activityData)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const deleteActivity = createAsyncThunk(
  'activity/delete',
  async (activityId, thunkAPI) => {
    try {
      return await activityService.deleteActivity(activityId)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const activitySlice = createSlice({
  name: "actvity",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createActivity.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createActivity.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.activities.push(action.payload)
      })
      .addCase(createActivity.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getActivities.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getActivities.fulfilled, (state, action) => {
        state.isLoading = false
        state.activities = action.payload
      })
      .addCase(getActivities.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getActivity.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getActivity.fulfilled, (state, action) => {
        state.isLoading = false
        state.activity = action.payload
      })
      .addCase(getActivity.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateActivity.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.activity = action.payload
        state.activities = state.activities.map(activity => activity.id === action.payload.id ? (action.payload) : activity)
      })
      .addCase(deleteActivity.fulfilled, (state, action) => {
        console.log(action.payload)
        state.isLoading = false 
        state.isError = false
        state.activities = state.activities.filter(activity => activity.id !== action.payload)
      })

  }
})

export const {reset} = activitySlice.actions
export default activitySlice.reducer