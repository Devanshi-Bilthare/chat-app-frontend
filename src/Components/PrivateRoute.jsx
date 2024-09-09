import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    // Check if the user is logged in by checking localStorage
    const isAuthenticated = !!localStorage.getItem('user'); // If 'user' exists in localStorage, the user is authenticated

    // Redirect to /signin if not authenticated, otherwise render the children components
    return isAuthenticated ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;
