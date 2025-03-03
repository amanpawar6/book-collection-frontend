// SignUpPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css';
import { postAxiosCall } from '../utils/Axios';
import '../styles/Signup.css';

const SignUpPage = () => {
    let navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => {
                setToastMessage('');
            }, 1000); // Close toast after 1 second
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const errors = validateForm();
            if (Object.keys(errors).length === 0) {
                // Here you can perform sign-up API call
                // console.log('Signing up with:', username, password);
                let body = {
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    userName: username.trim(),
                    password,
                    repeatPassword: password,
                    email: email.trim(),
                }
                const response = await postAxiosCall(`/signup`, body);

                setToastMessage(response?.data?.message);
                navigate('/login');

            } else {
                setErrors(errors);
            }
        } catch (error) {
            console.log("Error on signup", JSON.parse(error?.message));
            let errorMessage = error?.message ? JSON.parse(error?.message) : "";

            if (errorMessage?.status === 400) {
                setToastMessage(errorMessage?.data?.message);
            } else {
                setToastMessage("Something went wrong.");
            }

            // setErrors(errors?.response?.data?.message);
        }
    };

    const validateForm = () => {
        let errors = {};
        if (!firstName.trim()) {
            errors.firstName = 'First Name is required';
        }
        if (!lastName.trim()) {
            errors.lastName = 'Last Name is required';
        }
        if (!email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Email address is invalid';
        }
        if (!username.trim()) {
            errors.username = 'Username is required';
        }
        if (!password.trim()) {
            errors.password = 'Password is required';
        } else if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters long';
        }
        return errors;
    };

    return (
        <div className="signup-container">
            <h2>Sign Up</h2>
            <form className="signup-form" onSubmit={handleSubmit}>
                <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                {errors?.firstName && <p className="error">{errors?.firstName}</p>}
                <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                {errors?.lastName && <p className="error">{errors?.lastName}</p>}
                <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                {errors?.email && <p className="error">{errors?.email}</p>}
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                {errors?.username && <p className="error">{errors?.username}</p>}
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {errors?.password && <p className="error">{errors?.password}</p>}
                <button type="submit">Sign Up</button>
            </form>
            {toastMessage && <div className="toast">{toastMessage}</div>}
        </div>
    );
};

export default SignUpPage;
