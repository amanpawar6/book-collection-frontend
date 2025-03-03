import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAxiosCall } from '../utils/Axios';
import '../styles/BookDetails.css';

const BookDetails = () => {
    const { id } = useParams(); // Get the book ID from the URL
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const response = await getAxiosCall(`/get-book-details/${id}`);
                setBook(response.data);
            } catch (error) {
                setError('Failed to fetch book details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetails();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="book-details">
            <h2>{book.title}</h2>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Genre:</strong> {book.genre}</p>
            <p><strong>Publication Year:</strong> {book.publicationYear}</p>
            {book.coverImage ? (
                <img src={book.coverImage} alt="Book Cover" className="book-cover" />
            ) : (
                <div className="default-cover">
                    <span>No Cover Available</span>
                </div>
            )}
            {/* Add more details or actions as needed */}
        </div>
    );
};

export default BookDetails;