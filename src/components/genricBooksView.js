import React, { useEffect, useState } from 'react';
import BookCard from './BookCard';
import { useParams } from 'react-router-dom';
import { getAxiosCall, postAxiosCall } from '../utils/Axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooksSuccess } from '../redux/slices/bookSlice';
import '../styles/GenreBookScreen.css';

const GenreBookScreen = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth); // Get the logged-in user
    const { genre } = useParams();
    const { query, results, isSearching } = useSelector((state) => state.search); // Get search state from Redux

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchGenreBooks = async () => {
        try {
            const response = await getAxiosCall(`/get-books-by-genre/${genre}`);
            setBooks(response);
        } catch (error) {
            setError('Failed to fetch books. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGenreBooks();
    }, [genre]);

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

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="book-cards">
            {displayedBooks?.map((book) => (
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

export default GenreBookScreen;