import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Remove useDispatch
import { useNavigate } from 'react-router-dom';
import { getAxiosCall, postAxiosCall } from '../utils/Axios';
import { fetchBooksSuccess, toggleFilterBooks, resetBooks } from '../redux/slices/bookSlice';
import { logout } from '../redux/slices/authSlice';
import BookCard from './BookCard';
import { showToast } from '../utils/toast';
import '../styles/ReadBooks.css';

const ReadBooks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth); // Get the logged-in user
  // const [books, setBooks] = useState([]);
  const { books, loading, error, currentPage, totalPages } = useSelector((state) => state.books); // Get pagination data
  const { query, results, isSearching } = useSelector((state) => state.search); // Get search state from Redux

  const [page, setPage] = useState(1); // Track the current page
  const observer = useRef(); // Ref for the Intersection Observer

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Reset books when the component unmounts
  useEffect(() => {
    dispatch(resetBooks()); // Reset books only when the component mounts
  }, []);

  // Fetch read books
  useEffect(() => {
    const fetchReadBooks = async (replace = false) => {
      try {
        let headers = {
          Authorization: token,
        };
        const response = await getAxiosCall(`/user-book-status/read?customerId=${user._id}&page=${page}`, { headers });
        dispatch(fetchBooksSuccess({ data: response.data, currentPage: response.currentPage, totalPages: response.totalPages, replace }));
      } catch (error) {
        console.error('Error fetching read books:', error);
        let errorMessage = error?.message ? JSON.parse(error?.message) : "";
        if (errorMessage?.status === 403 || errorMessage?.status === 401) {
          dispatch(logout());
          showToast('Session expire, Please login again.', 'error');
          navigate('/login');
        }
      }
    };

    if (user) {
      fetchReadBooks(page === 1); // Pass true if it's the first page
    }
  }, [user, page]);

  // Infinite scroll logic
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return; // Don't trigger if already loading
      if (observer.current) observer.current.disconnect(); // Disconnect the previous observer

      // Create a new Intersection Observer
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && currentPage < totalPages) {
          setPage((prevPage) => prevPage + 1); // Load the next page
        }
      });

      if (node) observer.current.observe(node); // Observe the last book element
    },
    [loading, currentPage, totalPages]
  );

  // Toggle read status for a book
  const toggleReadStatus = async (bookId) => {
    if (!user) {
      showToast('Please log in to mark books as read/unread.', "warning");
      return;
    }

    try {

      let headers = {
        Authorization: token
      }

      // Call the API to toggle the read status
      await postAxiosCall('/user-book-status/toggle', { customerId: user._id, bookId }, { headers });

      // Update the local state immediately
      dispatch(toggleFilterBooks({ bookId }));

      // Refresh the books list after toggling status
      // const response = await getAxiosCall('/get-books');
      // dispatch(fetchBooksSuccess(response?.data));
    } catch (error) {
      // console.error('Error toggling read status:', error);
      let errorMessage = error?.message ? JSON.parse(error?.message) : "";
      if (errorMessage?.status === 403 || errorMessage?.status === 401) {
        dispatch(logout());
        showToast('Session expire, Please login again.', 'error');
        navigate('/login');
      }
    }
  };

  // Display search results or all books
  const displayedBooks = isSearching ? results : books;

  return (
    <div className="book-cards">
      {displayedBooks?.length ? (
        displayedBooks?.map((book, index) => {
          // Add a ref to the last book element
          if (displayedBooks.length === index + 1) {
            return (
              <div ref={lastBookElementRef} key={book._id}>
                <BookCard
                  book={book}
                  user={user}
                  onToggleRead={() => toggleReadStatus(book._id)}
                />
              </div>
            );
          } else {
            return (
              <BookCard
                key={book._id}
                book={book}
                user={user}
                onToggleRead={() => toggleReadStatus(book._id)}
              />
            );
          }
        })
      ) : (
        <div className="no-results">No books found.</div>
      )}
      {loading && page > 1 && <div>Loading more books...</div>} {/* Loading spinner for additional pages */}
    </div>
  );
};

export default ReadBooks;