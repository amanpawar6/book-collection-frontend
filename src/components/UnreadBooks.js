import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAxiosCall, postAxiosCall } from '../utils/Axios';
import { fetchBooksSuccess } from '../redux/slices/bookSlice';
import BookCard from './BookCard';
import '../styles/UnreadBooks.css';

const UnreadBooks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth); // Get the logged-in user
  const [books, setBooks] = useState([]);

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch unread books
  useEffect(() => {
    const fetchUnreadBooks = async () => {
      try {
        let headers = {
          Authorization: token
        }
        const response = await getAxiosCall(`/user-book-status/unread?customerId=${user._id}`, { headers });
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching unread books:', error);
      }
    };

    if (user) {
      fetchUnreadBooks();
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

      await postAxiosCall('/user-book-status/toggle', { customerId: user._id, bookId }, { headers });

      // Refresh the books list after toggling status
      const response = await getAxiosCall('/get-books');
      dispatch(fetchBooksSuccess(response?.data));
    } catch (error) {
      console.error('Error toggling read status:', error);
    }
  };

  return (
    <div className="book-cards">
      {books?.map((book) => (
        <BookCard
          key={book._id}
          book={book}
          user={user}
          onToggleRead={() => toggleReadStatus(book._id)}
        />
      ))}
    </div>
  );
};

export default UnreadBooks;