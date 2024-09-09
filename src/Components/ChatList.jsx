import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetAll } from '../features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { HiDotsVertical } from "react-icons/hi";
import { isAdmin } from '../utils/config';
import { GetUserChatRoom } from '../features/chatRoom/chatRoomSlice';
import { getUnreadMessage } from '../features/messages/messageSlice';
import socket from '../utils/socket'; 

const ChatList = ({setIsCreateGroup}) => {
    // Accessing currentUser and allUsers directly from useSelector
    const currentUser = useSelector(state => state.auth?.auth);
    const allUsers = useSelector(state => state.auth?.allUsers);
    const allGroups = useSelector(state => state.chatRoom?.chatRooms)
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const unReadmessages = useSelector(state => state.message?.unreadMessage)

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogOut =() => {
        localStorage.clear()
        navigate('/signin')
    }

    const handleChatClick = (userId) => {
        // Dispatch an action to fetch or update unread messages
        dispatch(getUnreadMessage());
    
        // Navigate to the chat
        navigate(`/chats/${userId}`);
    };

    const handleGrpClick = (grpId) => {
        // Dispatch an action to fetch or update unread messages
        dispatch(getUnreadMessage());
    
        // Navigate to the chat
        navigate(`/chats/${grpId}`);
    };


   
    

    useEffect(() => {
        dispatch(GetAll());
        dispatch(GetUserChatRoom(currentUser?._id))
        dispatch(getUnreadMessage())
    }, [dispatch, currentUser?._id]);

    useEffect(() => {
        // Listen for new incoming messages
        
        socket.on('receiveMessage', (newMessage) => {
            console.log('New message received:', newMessage);
            if (newMessage.receiver === currentUser._id) {
                // Re-fetch unread messages when a new message arrives
                dispatch(getUnreadMessage());
            }
        });

        return () => {
            // Clean up the listener when the component unmounts
            socket.off('receiveMessage');
        };
    }, [currentUser?._id,dispatch]);


    const getUserUnreadMessages = (userId) => {
        const filteredMessages = unReadmessages?.filter(message => 
            !message.read && 
            message.receiver === currentUser?._id &&
            message.sender === userId && 
            message.chatRoom == null
        );

        return filteredMessages
       
    };

    const getGroupUnreadMessages = (groupId) => {
        return unReadmessages?.filter(message =>
            !message.read &&
            message.chatRoom === groupId // Group messages should have a chatRoom value
        );
    };

    return (
        <div className='w-[20%] border-2 h-screen overflow-y-scroll custom-scroll bg-slate-100 relative'>
            <div className='w-full py-5 px-5 border-b-2 flex items-center justify-between'>
            <h1 >{currentUser?.username}</h1>
          
                <div className={`cursor-pointer p-2 ${isDropdownOpen ? "bg-gray-300" : ""}  rounded-full`} onClick={toggleDropdown}><HiDotsVertical /></div>

            {isDropdownOpen && (
                <div className='absolute top-14 right-5 w-48 bg-white shadow-md rounded-md z-2'>
                    <ul>
                        <li
                            className='py-2 px-4 hover:bg-gray-100 cursor-pointer'
                            onClick={handleLogOut}
                        >
                            Logout
                        </li>
                        {/* <li
                            className='py-2 px-4 hover:bg-gray-100 cursor-pointer'
                        >
                            Edit Profile
                        </li> */}
                       {isAdmin() ? <> <li
                            className='py-2 px-4 hover:bg-gray-100 cursor-pointer'
                            onClick={() => setIsCreateGroup(true)}
                        >
                            Create Group
                        </li>
                             <li
                             className='py-2 px-4 hover:bg-gray-100 cursor-pointer'
                         >
                             <Link to={'/signup'}>Add User</Link>
                         </li>
                         </>
                        : null}
                       
                    </ul>
                </div>
            )}
            </div>
            {
                allGroups?.map((group, idx) => {
                    
                    if (group.username !== currentUser?.username) {
                        const groupUnreadMessages = getGroupUnreadMessages(group._id);
                        return <Link onClick={() => handleGrpClick(group._id)} to={`/groupChats/${group._id}`}  key={idx}><div className='w-full py-5 px-5 flex justify-between border-b-2 hover:bg-gray-300'> <p>{group.name}</p>                             {groupUnreadMessages?.length > 0 ?
                            <p className='bg-blue-400 px-2 rounded-full text-white'> {groupUnreadMessages?.length} </p>: null} </div></Link>; // Return the JSX
                    }
                    return null; // Return null if the condition is not met
                })
            }
            {
                allUsers?.map((user, idx) => {
                    if (user.username !== currentUser?.username) {
                        const userUnreadMessages = getUserUnreadMessages(user._id);

                        return <Link  onClick={() => handleChatClick(user._id)} to={`/chats/${user._id}`}  key={idx}><div className=' flex justify-between w-full py-5 px-5 border-b-2 hover:bg-gray-300'>
                            <p>{user.username} {user.role == 'admin' ? `(${user.role})` : null}</p>
                            {userUnreadMessages?.length > 0 ?
                            <p className='bg-blue-400 px-2 rounded-full text-white'> {userUnreadMessages?.length} </p>: null}
                        </div>
                            
                        </Link>; // Return the JSX
                    }
                    return null; // Return null if the condition is not met
                })
            }
        </div>
    );
};

export default ChatList;
