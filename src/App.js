import React, { useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash.debounce'; // Import debounce
import SearchBar from './components/SearchBar';
import AddBookForm from './components/AddBookForm';
import Header from './components/Header';
import GenreScreen from './components/GenreScreen';
import ReadBooks from './components/ReadBooks';
import UnreadBooks from './components/UnreadBooks';
import Login from './components/Login';
import Signup from './components/Signup';
import BookDetails from './components/BookDetails';
import HomePage from './components/HomePage';
import GenreBookScreen from './components/genricBooksView';
import { login, logout } from './redux/slices/authSlice'; // Import auth actions
import { setSearchQuery, setSearchResults, setIsSearching } from './redux/slices/searchSlice'; // Import search actions
import { getAxiosCall } from './utils/Axios';
import './styles/App.css';

// Create a new component to handle conditional rendering
const AppContent = () => {
  const location = useLocation(); // Now useLocation is inside a Router context
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth); // Get auth state from Redux
  const { query, results, isSearching } = useSelector((state) => state.search); // Get search state from Redux

  // Check if the user is logged in on app load
  useEffect(() => {
    const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn'));
    const userDetail = JSON.parse(localStorage.getItem('userDetails'));
    const token = localStorage.getItem('token');
    if (isLoggedIn) {
      dispatch(login({ user: userDetail, token })); // Update auth state in Redux
    }
  }, [dispatch]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query) {
        dispatch(setIsSearching(false)); // Reset search state if query is empty
        return;
      }

      dispatch(setIsSearching(true)); // Set isSearching to true
      try {
        const response = await getAxiosCall(`/get-books?query=${query}`);
        dispatch(setSearchResults(response.data)); // Update search results in Redux
      } catch (error) {
        console.error('Error searching books:', error);
      }
    }, 300), // 300ms delay
    [dispatch]
  );

  // Handle search input changes
  const handleSearch = (query) => {
    dispatch(setSearchQuery(query)); // Update the search query in Redux
    debouncedSearch(query); // Call the debounced search function
  };

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel(); // Cancel any pending debounced calls
    };
  }, [debouncedSearch]);

  // Conditionally render the SearchBar based on the route
  const showSearchBar = !['/login', '/signup'].includes(location.pathname);

  return (
    <>
      <Header user={user} onLogout={() => dispatch(logout())} /> {/* Pass logout action */}
      {showSearchBar && <SearchBar handleSearch={handleSearch} />} {/* Conditionally render SearchBar */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/genres" element={<GenreScreen />} />
        <Route path="/genres/:genre" element={<GenreBookScreen />} />
        <Route path="/addbooks" element={<AddBookForm />} />
        <Route path="/readbooks" element={<ReadBooks />} />
        <Route path="/unreadbooks" element={<UnreadBooks />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent /> {/* Render AppContent inside the Router */}
    </Router>
  );
};

export default App;