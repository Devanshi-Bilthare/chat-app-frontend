import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Chats from './Components/Chats';
import PrivateRoute from './Components/PrivateRoute'
import './app.css';
import AdminRoute from './Components/AdminRoute';
import GroupChats from './Components/GroupChats';

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<AdminRoute><SignUp /></AdminRoute>} />
      {/* <Route path="/signup" element={<SignUp />} /> */}


      {/* Private Route for Home and Nested Routes */}
      <Route path="/" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      >
        {/* Nested Route for Chats */}
        <Route path="chats/:id" element={<Chats />} />
        <Route path="groupChats/:id" element={<GroupChats />} />
      </Route>
      {/* <Route path='/create-group' element={<PrivateRoute><CreateGroup/></PrivateRoute>}/> */}
    </Routes>
  );
};

export default App;
