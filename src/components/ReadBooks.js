import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Remove useDispatch
import { useNavigate } from 'react-router-dom';
import { getAxiosCall, postAxiosCall } from '../utils/Axios';
import { fetchBooksSuccess, toggleFilterBooks } from '../redux/slices/bookSlice';
import BookCard from './BookCard';
import '../styles/ReadBooks.css';

const ReadBooks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth); // Get the logged-in user
  // const [books, setBooks] = useState([]);
  const { books, loading, error, currentPage, totalPages } = useSelector((state) => state.books); // Get pagination data
  const { query, results, isSearching } = useSelector((state) => state.search); // Get search state from Redux

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch read books
  useEffect(() => {
    const fetchReadBooks = async () => {
      try {
        let headers = {
          Authorization: token
        }
        const response = await getAxiosCall(`/user-book-status/read?customerId=${user._id}`, { headers });
        dispatch(fetchBooksSuccess({ data: response.data, currentPage, totalPages, replace: true }));
      } catch (error) {
        console.error('Error fetching read books:', error);
      }
    };

    if (user) {
      fetchReadBooks();
    }
  }, [user]);

  // Toggle read status for a book
  const toggleReadStatus = async (bookId) => {
    if (!user) {
      alert('Please log in to mark books as read/unread.');
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
      console.error('Error toggling read status:', error);
    }
  };

  // Display search results or all books
  const displayedBooks = isSearching ? results : books;

  return (
    <div className="book-cards">
      {displayedBooks?.map((book) => (
        <BookCard
          key={book._id}
          book={book}
          user={user}
          onToggleRead={() => toggleReadStatus(book._id)} // Pass toggle function to BookCard
        />
      ))}
    </div>
  );
};

export default ReadBooks;