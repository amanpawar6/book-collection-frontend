import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/BookCard.css';

const BookCard = ({ book, user, onToggleRead }) => {

    // const defaultImage = 'https://via.placeholder.com/150';

    return (
        <div className="book-card">
            <Link to={`/books/${book._id}`} className="book-link"> {/* Add this link */}
                {book.coverImage ? (
                    <img src={book.coverImage} alt="Book Cover" className="default-cover" />
                ) : (
                    <div className="default-cover">
                        <span>No Cover Available</span>
                    </div>
                )}
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                <p>{book.genre}</p>
                <p>{book.publicationYear}</p>
            </Link>
            {user ? (
                <button onClick={onToggleRead}>
                    {book.read ? 'Mark as Unread' : 'Mark as Read'}
                </button>
            ) : (
                <p style={{ color: 'red' }}>Please log in to mark this book as read/unread.</p>
            )}
        </div>
    );
};

export default BookCard;