import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { auth, logout } = useAuth();

  return (
    <nav>
      <Link to="/">Dashboard</Link>
      <Link to="/stores">Stores</Link>
      {auth ? (
        <>
          <span>{auth.user.name} ({auth.user.role})</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
      {auth?.user?.role === 'System Administrator' && (
            <Link to="/admin">Admin</Link>
        )}

      {auth?.user?.role === 'Store Owner' && (
          <Link to="/owner">Owner Dashboard</Link>
      )}


    </nav>
  );
};

export default Navbar;
