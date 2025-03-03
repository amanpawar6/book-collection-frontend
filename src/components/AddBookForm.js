import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addBook } from '../redux/slices/bookSlice';
import { postAxiosCall } from '../utils/Axios';
import '../styles/AddBookForm.css';

const AddBookForm = () => {
    const dispatch = useDispatch();
    const [book, setBook] = useState({ title: '', author: '', genre: '', publicationYear: '' });
    const [coverImage, setCoverImage] = useState(null);
    const [toastMessage, setToastMessage] = useState('');
    const [fileError, setFileError] = useState(''); // New state for file error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFileError(''); // Clear previous file error

        if (!coverImage) {
            setFileError('Please select a cover image.');
            return;
        }

        const formData = new FormData();
        formData.append('title', book.title);
        formData.append('author', book.author);
        formData.append('genre', book.genre);
        formData.append('publicationYear', book.publicationYear);
        formData.append('coverImage', coverImage);

        try {
            const response = await postAxiosCall('/add-book', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            dispatch(addBook(response.data));
            setToastMessage("Book added successfully.");
            setBook({ title: '', author: '', genre: '', publicationYear: '' });
            setCoverImage(null);
        } catch (error) {
            console.error('Error adding book:', error);
            setToastMessage("Failed to add book. Please try again.");
        }
    };

    return (
        <div className="book-container">
            <h2>ADD BOOK</h2>
            <form className="book-form" onSubmit={handleSubmit}>
                <input name="title" placeholder="Title" value={book.title} onChange={(e) => setBook({ ...book, title: e.target.value })} />
                <input name="author" placeholder="Author" value={book.author} onChange={(e) => setBook({ ...book, author: e.target.value })} />
                <input name="genre" placeholder="Genre" value={book.genre} onChange={(e) => setBook({ ...book, genre: e.target.value })} />
                <input name="publicationYear" placeholder="Publication Year" value={book.publicationYear} onChange={(e) => setBook({ ...book, publicationYear: e.target.value })} />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverImage(e.target.files[0])}
                />
                {fileError && <p className="error">{fileError}</p>} {/* Display file error */}
                <button type="submit">Add Book</button>
            </form>
            {toastMessage && <div className="toast">{toastMessage}</div>}
        </div>
    );
};

export default AddBookForm;