import React, { useEffect, useState, useRef, useCallback } from 'react';
import BookCard from './BookCard';
import { useParams, useNavigate } from 'react-router-dom';
import { getAxiosCall, postAxiosCall } from '../utils/Axios';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { fetchBooksStart, fetchBooksSuccess, fetchBooksFailure, resetBooks, toggleReadStatusSuccess } from '../redux/slices/bookSlice';
import { showToast } from '../utils/toast';
import '../styles/GenreBookScreen.css';

const GenreBookScreen = () => {
    const dispatch = useDispatch();
    const { genre } = useParams();
    const navigate = useNavigate();
    const { user, token } = useSelector((state) => state.auth); // Get the logged-in user
    const { books, loading, error, currentPage, totalPages } = useSelector((state) => state.books); // Get pagination data
    const { query, results, isSearching } = useSelector((state) => state.search); // Get search state from Redux

    const [page, setPage] = useState(1); // Track the current page
    const observer = useRef(); // Ref for the Intersection Observer


    // Reset books when the component unmounts
    useEffect(() => {
        return () => {
            dispatch(resetBooks()); // Reset the books state when the component unmounts
        };
    }, []);

    const fetchGenreBooks = async (replace = false) => {
        try {
            dispatch(fetchBooksStart());
            const response = await getAxiosCall(`/get-books-by-genre/${genre}?page=${page}`);
            // setBooks(response);
            dispatch(fetchBooksSuccess({ data: response.data, currentPage: response.currentPage, totalPages: response.totalPages, replace })); // Pass the API response to Redux
        } catch (error) {
            dispatch(fetchBooksFailure(error.message));
            showToast('Failed to fetch books. Please try again later.', "error");
        }
    };

    useEffect(() => {
        fetchGenreBooks(page === 1);
    }, [genre, page]);

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

            const response = await postAxiosCall('/user-book-status/toggle', { customerId: user._id, bookId }, { headers });

            // Update the local state immediately
            const updatedReadStatus = response.data.isDeleted ? false : true; // Assuming the API returns the updated read status
            dispatch(toggleReadStatusSuccess({ bookId, read: updatedReadStatus }));

            showToast(`Book marked as ${updatedReadStatus ? 'read' : 'unread'}`, 'success');

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
            } else {
                showToast('Failed to update the status', 'error');
            }
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

export default GenreBookScreen;