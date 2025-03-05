import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addBook } from '../redux/slices/bookSlice';
import { logout } from '../redux/slices/authSlice';
import { postAxiosCall } from '../utils/Axios';
import { showToast } from '../utils/toast';
import '../styles/AddBookForm.css';

const AddBookForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth); // Get the logged-in user
    const [book, setBook] = useState({ title: '', author: '', genre: '', publicationYear: '' });
    const [coverImage, setCoverImage] = useState(null);
    const [error, setErrors] = useState(''); // New state for file error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(''); // Clear previous file error

        const errors = validateForm();
        if (Object.keys(errors).length === 0) {
            const formData = new FormData();
            formData.append('title', book.title);
            formData.append('author', book.author);
            formData.append('genre', book.genre);
            formData.append('publicationYear', book.publicationYear);
            formData.append('coverImage', coverImage);

            try {
                const response = await postAxiosCall('/add-book', formData, {
                    headers: { 'Content-Type': 'multipart/form-data', Authorization: token },
                });

                dispatch(addBook(response.data));
                showToast("Book added successfully.", "success");
                setBook({ title: '', author: '', genre: '', publicationYear: '' });
                setCoverImage(null);
            } catch (error) {
                console.error('Error adding book:', error);
                let errorMessage = error?.message ? JSON.parse(error?.message) : "";
                if (errorMessage?.status === 403 || errorMessage?.status === 401) {
                    dispatch(logout());
                    showToast('Session expire, Please login again.', 'error');
                    navigate('/login');
                }
                showToast("Failed to add book. Please try again.", "error");
            }
        } else {
            setErrors(errors);
        }
    };

    const validateForm = () => {
        let errors = {};
        if (!book?.title?.trim()) {
            errors.title = 'Title is required';
        }
        if (!book?.author?.trim()) {
            errors.author = 'Author is required';
        }
        if (!book?.genre?.trim()) {
            errors.genre = 'Genre is required';
        }
        if (!book?.publicationYear?.trim()) {
            errors.publicationYear = 'Publication Year is required';
        }
        if (!coverImage) {
            errors.coverImage = 'Please select a cover image';
        }
        return errors;
    };

    return (
        <div className="book-container">
            <h2>ADD BOOK</h2>
            <form className="book-form" onSubmit={handleSubmit}>
                <input name="title" placeholder="Title" value={book.title} onChange={(e) => setBook({ ...book, title: e.target.value })} />
                {error?.title && <p className="error">{error?.title}</p>}
                <input name="author" placeholder="Author" value={book.author} onChange={(e) => setBook({ ...book, author: e.target.value })} />
                {error?.author && <p className="error">{error?.author}</p>}
                <input name="genre" placeholder="Genre" value={book.genre} onChange={(e) => setBook({ ...book, genre: e.target.value })} />
                {error?.genre && <p className="error">{error?.genre}</p>}
                <input name="publicationYear" placeholder="Publication Year" value={book.publicationYear} onChange={(e) => setBook({ ...book, publicationYear: e.target.value })} />
                {error?.publicationYear && <p className="error">{error?.publicationYear}</p>}
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverImage(e.target.files[0])}
                />
                {error?.coverImage && <p className="error">{error?.coverImage}</p>}
                <button type="submit">Add Book</button>
            </form>
        </div>
    );
};

export default AddBookForm;