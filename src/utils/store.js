import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../reducers/userReducer'
import sellerReducer from '../reducers/sellerReducer'
import productReducer from '../reducers/productReducer'
import theSellerReducer from '../reducers/theSellerReducer'

const store = configureStore({
  reducer: {
    user: userReducer,
    seller: sellerReducer,
    product: productReducer,
    theSeller: theSellerReducer,
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
})

export default store