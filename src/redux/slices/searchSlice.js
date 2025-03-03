import { createSlice } from '@reduxjs/toolkit';

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    query: '', // Current search query
    results: [], // Search results
    isSearching: false, // Whether a search is in progress
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.query = action.payload;
    },
    setSearchResults: (state, action) => {
      state.results = action.payload;
    },
    setIsSearching: (state, action) => {
      state.isSearching = action.payload;
    },
  },
});

export const { setSearchQuery, setSearchResults, setIsSearching } = searchSlice.actions;
export default searchSlice.reducer;