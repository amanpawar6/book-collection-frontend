import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    books: [],
    loading: false,
    error: null,
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
            state.books = action.payload;
            state.loading = false;
        },
        fetchBooksFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        addBook: (state, action) => {
            state.books.push(action.payload);
        },
    },
});

export const { fetchBooksStart, fetchBooksSuccess, fetchBooksFailure, addBook } = bookSlice.actions;
export default bookSlice.reducer;