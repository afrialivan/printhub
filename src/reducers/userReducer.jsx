/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import { getUser } from "../services/user";

const userSlice = createSlice({
  name: 'user',
  initialState: [],
  reducers: {
    setUser(state, action) {
      return action.payload
    },
  }
})

export const { setUser } = userSlice.actions

export const initializeUser = () => {
  return async dispatch => {
    const seller = await getUser()
    dispatch(setUser(seller))
  }
}

export default userSlice.reducer