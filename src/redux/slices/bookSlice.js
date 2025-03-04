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
            const { data, currentPage, totalPages, replace } = action.payload; // Add replace flag
            if (replace) {
                state.books = data; // Replace the list if replace flag is true (for ReadBooks)
            } else {
                state.books = [...state.books, ...data]; // Append for pagination (Homepage)
            }
            state.currentPage = currentPage;
            state.totalPages = totalPages;
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
        toggleFilterBooks: (state, action) => {
            const { bookId } = action.payload; 
            state.books = state.books.filter((book) => book._id !== bookId); // Remove the book by filtering
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
    toggleFilterBooks,
} = bookSlice.actions;
export default bookSlice.reducer;