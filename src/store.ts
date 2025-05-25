import { configureStore } from '@reduxjs/toolkit';
import orderReducer from './context/slices/orderSlice';

export const store = configureStore({
  reducer: {
    order: orderReducer,
  },
});