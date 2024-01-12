/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import { auth } from "../config/firebase";

const orderSlice = createSlice({
  name: 'order',
  initialState: [],
  reducers: {
    setOrder(state, action) {
      return action.payload
    },
  }
})

export const { setOrder } = orderSlice.actions

export const initializeOrder = (order) => {
  return async dispatch => {
    // const seller = await getSeller()
    const filteredData = order.find((data) => data.userId === auth?.currentUser?.uid)
    dispatch(setOrder(filteredData))
  }
}

export default orderSlice.reducer