import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooksStart, fetchBooksSuccess, fetchBooksFailure } from '../redux/slices/bookSlice';
import BookCard from './BookCard';
import { getAxiosCall, postAxiosCall } from '../utils/Axios';
import "../styles/HomePage.css";

const HomePage = () => {
  const dispatch = useDispatch();
  const { books, loading, error } = useSelector((state) => state.books);
  const { user } = useSelector((state) => state.auth); // Get the logged-in user
  const { query, results, isSearching } = useSelector((state) => state.search); // Get search state from Redux

  // Fetch all books
  useEffect(() => {
    const fetchBooks = async () => {
      dispatch(fetchBooksStart());
      try {
        const response = await getAxiosCall('/get-books');
        dispatch(fetchBooksSuccess(response?.data));
      } catch (error) {
        dispatch(fetchBooksFailure(error.message));
      }
    };
    fetchBooks();
  }, [dispatch]);

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
      dispatch(fetchBooksSuccess(response?.data));
    } catch (error) {
      console.error('Error toggling read status:', error);
    }
  };

  // Display search results or all books
  const displayedBooks = isSearching ? results : books;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="book-cards">
      {displayedBooks.length ? (
        displayedBooks.map((book) => (
          <BookCard
            key={book._id}
            book={book}
            user={user}
            onToggleRead={() => toggleReadStatus(book._id)}
          />
        )
        )) : (<div className="no-results">No books found.</div>)}
    </div>
  );
};

export default HomePage;