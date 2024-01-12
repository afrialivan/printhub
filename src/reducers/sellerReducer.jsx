/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import { getSeller } from "../services/Seller";

const sellerSlice = createSlice({
  name: 'seller',
  initialState: [],
  reducers: {
    appendSeller(state, action) {
      state.push(action.payload)
    },
    setSeller(state, action) {
      return action.payload
    },
  }
})

export const { setSeller, appendSeller } = sellerSlice.actions

export const initializeSeller = () => {
  return async dispatch => {
    const seller = await getSeller()
    dispatch(setSeller(seller))
  }
}

export const createSeller = (content) => {
  return async dispatch => {
    const newSeller = await createSeller()
    dispatch(appendSeller(newSeller))
  }
}


export default sellerSlice.reducer