import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import '../styles/Login.css'; // Import CSS
import { postAxiosCall } from '../utils/Axios';
import { login, logout } from '../redux/slices/authSlice';
import { showToast } from '../utils/toast';
import '../styles/Login.css';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      try {
        let body = { email: email.trim(), password };
        const response = await postAxiosCall('/login', body);
        if (response?.success) {
          showToast(response?.message || 'Successfully logged in.', "success");
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('token', response?.data?.token);
          localStorage.setItem('userDetails', JSON.stringify(response?.data?.userDetails));
          dispatch(login({ user: response?.data?.userDetails, token: response?.data?.token }));
          navigate('/');
        } else {
          showToast(response?.data?.message || 'Login failed. Please try again.', "error");
        }
      } catch (error) {
        let errorMessage = error?.message ? JSON.parse(error?.message) : "";
        console.log(errorMessage);
        if (errorMessage?.status === 403 || errorMessage?.status === 401) {
          dispatch(logout());
          showToast('Session expire, Please login again.', 'error');
          navigate('/login');
        } else if (errorMessage?.status === 404) {
          showToast(errorMessage?.data?.message, "error");
        } else {
          showToast('An error occurred while logging in. Please try again later.', "error");
        }
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
    </div>
  );
};

export default LoginPage;