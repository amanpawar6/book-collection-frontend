import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bookReducer from './slices/bookSlice';
import searchReducer from './slices/searchSlice'; // Import the search slice

const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
    search: searchReducer, // Add the search slice
  },
});

export default store;