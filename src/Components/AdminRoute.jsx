import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const userString = localStorage.getItem('user');
  const [isAdmin, setIsAdmin] = useState(null); // Start with `null`

  // Parse the JSON string to an object
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    // Set isAdmin based on user's role
    if (user && user.role === 'admin') {
      setIsAdmin(true);  // User is admin
    } else {
      setIsAdmin(false); // User is not admin
    }
  }, [user]); // Only run when `user` changes

  // Show a loading state while checking the user's role
  if (isAdmin === null) {
    return <div>Loading...</div>; // You can replace this with a better loading spinner if needed
  }

  // If user is an admin, render the children; otherwise, redirect to home
  return isAdmin ? children : <Navigate to="/" />;
};

export default AdminRoute;
