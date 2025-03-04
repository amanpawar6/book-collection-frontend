import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import '../styles/Header.css';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth); // Get user from Redux

  const handleLogout = () => {
    dispatch(logout()); // Dispatch logout action
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="header">
      <Link to="/"><h1>Personal Book Collection</h1></Link>
      <nav>
        <Link to="/genres">All Genres</Link>
        {user && <Link to="/addbooks">Add Book</Link>}
        <Link to="/readbooks">Read Books</Link>
        <Link to="/unreadbooks">Unread Books</Link>
        {user ? (
          <div className="user-dropdown">
            <span>{user.userName}</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Header;