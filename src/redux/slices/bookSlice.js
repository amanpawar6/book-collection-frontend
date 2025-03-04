import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  books: [], // List of books
  loading: false, // Loading state
  error: null, // Error state
  currentPage: 1, // Current page number
  totalPages: 1, // Total number of pages
};

const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    fetchBooksStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBooksSuccess: (state, action) => {
      const { data, currentPage, totalPages } = action.payload; // Extract data from the API response
      state.books = [...state.books, ...data]; // Append new books to the existing list
      state.currentPage = currentPage; // Update the current page
      state.totalPages = totalPages; // Update the total pages
      state.loading = false;
    },
    fetchBooksFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    addBook: (state, action) => {
      state.books.push(action.payload); // Add a new book to the list
    },
    resetBooks: (state) => {
      state.books = []; // Reset the books list
      state.currentPage = 1; // Reset the current page
      state.totalPages = 1; // Reset the total pages
    },
    toggleReadStatusSuccess: (state, action) => {
      const { bookId, read } = action.payload; // Get the book ID and new read status
      const bookIndex = state.books.findIndex((book) => book._id === bookId); // Find the book in the list
      if (bookIndex !== -1) {
        state.books[bookIndex].read = read; // Update the read status
      }
    },
  },
});

export const {
  fetchBooksStart,
  fetchBooksSuccess,
  fetchBooksFailure,
  addBook,
  resetBooks,
  toggleReadStatusSuccess,
} = bookSlice.actions;
export default bookSlice.reducer;