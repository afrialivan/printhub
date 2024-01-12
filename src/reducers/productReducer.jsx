/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import { getProduct, getSeller } from "../services/Seller";

const sellerSlice = createSlice({
  name: 'seller',
  initialState: [],
  reducers: {
    setProduct(state, action) {
      return action.payload
    },
  }
})

export const { setProduct } = sellerSlice.actions

export const initializeProduct = (id) => {
  return async dispatch => {
    const producs = await getProduct()
    const data = producs.filter((produc) => produc.userId === id)
    dispatch(setProduct(data))
  }
}

export default sellerSlice.reducer