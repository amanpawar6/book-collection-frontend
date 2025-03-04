import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooksStart, fetchBooksSuccess, fetchBooksFailure, resetBooks } from '../redux/slices/bookSlice';
import BookCard from './BookCard';
import { getAxiosCall, postAxiosCall } from '../utils/Axios';
import '../styles/HomePage.css';

const HomePage = () => {
  const dispatch = useDispatch();
  const { books, loading, error, currentPage, totalPages } = useSelector((state) => state.books); // Get pagination data
  const { user } = useSelector((state) => state.auth); // Get the logged-in user
  const { query, results, isSearching } = useSelector((state) => state.search); // Get search state from Redux

  const [page, setPage] = useState(1); // Track the current page
  const observer = useRef(); // Ref for the Intersection Observer

  // Reset books when the component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetBooks()); // Reset the books state when the component unmounts
    };
  }, [dispatch]);

  // Fetch all books
  useEffect(() => {
    const fetchBooks = async () => {
      dispatch(fetchBooksStart());
      try {
        const response = await getAxiosCall(`/get-books?page=${page}`); // Pass the page number
        dispatch(fetchBooksSuccess(response)); // Pass the API response to Redux
      } catch (error) {
        dispatch(fetchBooksFailure(error.message));
      }
    };
    fetchBooks();
  }, [dispatch, page]);

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
      alert('Please log in to mark books as read/unread.');
      return;
    }

    try {
      await postAxiosCall('/user-book-status/toggle', { customerId: user._id, bookId });

      // Refresh the books list after toggling status
      const response = await getAxiosCall('/get-books');
      dispatch(fetchBooksSuccess(response.data));
    } catch (error) {
      console.error('Error toggling read status:', error);
    }
  };

  // Display search results or all books
  const displayedBooks = isSearching ? results : books;

  if (loading && page === 1) return <div>Loading...</div>; // Initial loading
  if (error) return <div>Error: {error}</div>;

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

export default HomePage;