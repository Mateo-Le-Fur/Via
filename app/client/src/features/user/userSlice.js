import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import userService from "./userService"

const initialState = {
  users: [],
  user: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
}


export const getUser = createAsyncThunk(
  'user/get',
  async (userId, thunkAPI) => {
    try {
      return await userService.getUser(userId)
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

export const getUsers = createAsyncThunk(
  'user/getAll',
  async (_, thunkAPI) => {
    try {
      return await userService.getUsers()
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


export const updateUser = createAsyncThunk(
  'user/update',
  async (data, thunkAPI) => {
    const {userId, userData} = data
    console.log(data)
    try {
      return await userService.updateUser(userId,userData)
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

export const deleteUser = createAsyncThunk(
  'user/delete',
  async (userId, thunkAPI) => {
    try {
      return await userService.deleteUser(userId)
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

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.users = action.payload
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
        state.users = state.users.map(user => user.id === action.payload.id ? (action.payload) : user)
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        console.log(action.payload)
        state.isLoading = false 
        state.isError = false
        state.users = state.users.filter(user => user.id !== action.payload)
      })

  }
})

export const {reset} = userSlice.actions
export default userSlice.reducer