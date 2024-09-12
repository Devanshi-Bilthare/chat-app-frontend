import React, { useEffect, useState } from 'react'
import ChatList from '../Components/ChatList'
import { Outlet } from 'react-router-dom'
import Chats from '../Components/Chats'
import CreateGroup from '../Components/CreateGroup'
import socket from '../utils/socket'
import Image from '../assets/image1.png'

const Home = () => {
  const [isCreateGroup,setIsCreateGroup] = useState(false)

  useEffect(() => {
    // Get user ID from local storage
    const userString = localStorage.getItem("user");

// Parse the JSON string to an object
const user = userString ? JSON.parse(userString) : null;
    const userId = user._id

    if (userId) {
      // Emit setUserId to associate the user with the socket connection
      socket.emit('setUserId', userId);
    }

    // Optionally handle reconnection
    socket.on('connect', () => {
      if (userId) {
        socket.emit('setUserId', userId);
      }
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className='flex bg-gray-200 relative'>
        <ChatList setIsCreateGroup={setIsCreateGroup}/>
        <div className='w-screen h-screen flex flex-col justify-center items-center '><img src={Image} alt="" />
        </div>
        <Outlet>
            <Chats/>
        </Outlet>
        {isCreateGroup ? <CreateGroup setIsCreateGroup={setIsCreateGroup}/> : null}
    </div>
  )
}

export default Home