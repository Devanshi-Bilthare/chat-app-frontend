import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetAll, logout } from '../features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { HiDotsVertical } from "react-icons/hi";
import { isAdmin } from '../utils/config';
import { GetUserChatRoom } from '../features/chatRoom/chatRoomSlice';
import { getUnreadMessage } from '../features/messages/messageSlice';
import socket from '../utils/socket'; 
import { HiMenuAlt1 } from 'react-icons/hi';

const ChatList = ({setIsCreateGroup}) => {
    // Accessing currentUser and allUsers directly from useSelector
    const currentUser = useSelector(state => state.auth?.auth);
    const allUsers = useSelector(state => state.auth?.allUsers);
    const allGroups = useSelector(state => state.chatRoom?.chatRooms)
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isChatListOpen, setIsChatListOpen] = useState(true);

    const unReadmessages = useSelector(state => state.message?.unreadMessage)

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogOut = () => {
        dispatch(logout()); // Dispatch the logout action to clear the Redux state
        navigate('/signin'); // Redirect to sign-in page
    };

    const handleChatClick = (userId) => {
        // Dispatch an action to fetch or update unread messages
        // dispatch(getUnreadMessage());
    
        // Navigate to the chat
        setIsChatListOpen(false)
        navigate(`/chats/${userId}`);
    };

    const handleGrpClick = (grpId) => {
        // Dispatch an action to fetch or update unread messages
        // dispatch(getUnreadMessage());
    
        // Navigate to the chat
        setIsChatListOpen(false)
        navigate(`/chats/${grpId}`);
    };


   
    

    useEffect(() => {
        dispatch(GetAll());
        dispatch(GetUserChatRoom(currentUser?._id))
        dispatch(getUnreadMessage())
    }, [dispatch, currentUser?._id]);

    
        socket.on('receiveMessage', (newMessage) => {
            console.log('New message received:', newMessage);
            if (newMessage.receiver === currentUser._id || newMessage.room) {
                // Re-fetch unread messages when a new message arrives
                dispatch(getUnreadMessage());
            }
        });

     




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
        <div className='relative'>
              <button
                className='md:hidden bg-blue-500 text-white p-2 rounded-full fixed top-2 left-4 z-50'
                onClick={() => setIsChatListOpen(!isChatListOpen)}
            >
                <HiMenuAlt1 size={24} />
            </button>
              <div className={`fixed top-0 left-0 h-screen overflow-x-scroll custom-scroll w-[80%] md:w-[20%] bg-slate-100 border-r-2 z-40 transform transition-transform ease-in-out duration-300 ${
                    isChatListOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0`}>
            <div className={`w-full py-4 px-5  border-b-2 flex items-center justify-between`}>
            <h1 className='md:text-black text-slate-100'> {currentUser?.username}</h1>
          
                <div className={`cursor-pointer p-2 ${isDropdownOpen ? "bg-gray-300" : ""}  rounded-full`} onClick={toggleDropdown}><HiDotsVertical /></div>

            {isDropdownOpen && (
                <div className='absolute top-14 right-5 w-48 bg-white shadow-md rounded-md z-2'>
                    <ul>
                    {isChatListOpen ?
                    <li
                            className='py-2 px-4 hover:bg-gray-100 cursor-pointer'
                            
                        >
                           {currentUser?.username }
                        </li>
                        : null}
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
                         <li
                             className='py-2 px-4 hover:bg-gray-100 cursor-pointer'
                         >
                             <Link to={'/getAll'}>All Messages</Link>
                         </li>
                         {/* <li
                             className='py-2 px-4 hover:bg-gray-100 cursor-pointer'
                         >
                             <Link to={'/AllUser'}>All Users</Link>
                         </li> */}
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
                        return <Link onClick={() => handleGrpClick(group._id)} to={`/groupChats/${group._id}`}  key={idx}><div className='w-full py-4 px-5 flex justify-between border-b-2 hover:bg-gray-300'> <p>{group.name}</p>                             {groupUnreadMessages?.length > 0 ?
                            <p className='bg-blue-400 px-2 rounded-full text-white'> {groupUnreadMessages?.length} </p>: null} </div></Link>; // Return the JSX
                    }
                    return null; // Return null if the condition is not met
                })
            }
            {
                allUsers?.map((user, idx) => {
                    if (user.username !== currentUser?.username) {
                        const userUnreadMessages = getUserUnreadMessages(user._id);

                        return <Link  onClick={() => handleChatClick(user._id)} to={`/chats/${user._id}`}  key={idx}><div className=' flex justify-between w-full py-4 px-5 border-b-2 hover:bg-gray-300'>
                            <p>{user.username} {user.role == 'admin' ? `(${user.role})` : null}</p>
                            {userUnreadMessages?.length > 0 ?
                            <p className='bg-blue-400 px-2 rounded-full text-white'> {userUnreadMessages?.length} </p>: null}
                        </div>
                            
                        </Link>; // Return the JSX
                    }
                    return null; // Return null if the condition is not met
                })
            }
              {/* {isChatListOpen && (
                <div
                    className='fixed inset-0 opacity-50 z-30'
                    onClick={() => setIsChatListOpen(false)}
                ></div>
            )} */}
        </div>
        </div>
      

    );
};

export default ChatList;