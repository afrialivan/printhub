/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import { auth } from "../config/firebase";
import { getSeller } from "../services/Seller";

const theSellerSlice = createSlice({
  name: 'theSeller',
  initialState: [],
  reducers: {
    setTheSeller(state, action) {
      return action.payload
    },
  }
})

export const { setTheSeller } = theSellerSlice.actions

export const initializeTheSeller = () => {
  return async dispatch => {
    const seller = await getSeller()
    const filteredData = seller.find((data) => data.userId === auth?.currentUser?.uid)
    dispatch(setTheSeller(filteredData))
  }
}

export default theSellerSlice.reducer