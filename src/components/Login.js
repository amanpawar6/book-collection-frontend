import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import '../styles/Login.css'; // Import CSS
import { postAxiosCall } from '../utils/Axios';
import { login } from '../redux/slices/authSlice';
import '../styles/Login.css';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage('');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      try {
        let body = { email: email.trim(), password };
        const response = await postAxiosCall('/login', body);
        if (response?.success) {
          setToastMessage(response?.message || 'Successfully logged in.');
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('token', response?.data?.token);
          localStorage.setItem('userDetails', JSON.stringify(response?.data?.userDetails));
          dispatch(login({ user: response?.data?.userDetails, token: response?.data?.token }));
          navigate('/');
        } else {
          setToastMessage(response?.data?.message || 'Login failed. Please try again.');
        }
      } catch (error) {
        setToastMessage(error?.response?.data?.message || 'An error occurred while logging in. Please try again later.');
      }
    } else {
      setErrors(errors);
    }
  };

  const validateForm = () => {
    let errors = {};
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email address is invalid';
    }
    if (!password.trim()) {
      errors.password = 'Password is required';
    }
    return errors;
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {errors.email && <p className="error">{errors.email}</p>}
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {errors.password && <p className="error">{errors.password}</p>}
        <button type="submit">Login</button>
      </form>
      {toastMessage && <div className="toast">{toastMessage}</div>}
    </div>
  );
};

export default LoginPage;