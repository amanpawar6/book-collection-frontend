import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/BookCard.css';
import defaultImage from '../assests/No_Cover.jpg'; // Add your default image here

const BookCard = ({ book, user, onToggleRead }) => {
  
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = defaultImage; // Replace with default image
    e.target.alt = 'No cover available'; // Optional alt text
  };

  return (
    <div className="book-card">
      <Link to={`/books/${book._id}`} className="book-link">
        {book?.coverImage ? (
          <img
            src={book?.coverImage}
            alt="Book Cover"
            className="default-cover"
            onError={handleImageError} // Handle image error
          />
        ) : (
            <img
            src={defaultImage}
            alt="Book Cover"
            className="default-cover"
          />
        )}
        <h3>{book?.title}</h3>
        <p>{book?.author}</p>
        <p>{book?.genre}</p>
        <p>{book?.publicationYear}</p>
      </Link>
      {user ? (
        <button onClick={onToggleRead}>
          {book?.read ? 'Mark as Unread' : 'Mark as Read'}
        </button>
      ) : (
        <p style={{ color: 'red' }}>Please log in to mark this book as read/unread.</p>
      )}
    </div>
  );
};

export default BookCard;
