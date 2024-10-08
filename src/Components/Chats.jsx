import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getUnreadMessage, markMessagesAsRead, ReceiveOneToOne } from '../features/messages/messageSlice';
import SendMessage from './SendMessage';
import moment from 'moment';
import { GetUser } from '../features/auth/authSlice';
import image from '../assets/image.png'

import socket from '../utils/socket';

const Chats = () => {
    const params = useParams();
    const id = params.id; // Receiver ID
    const dispatch = useDispatch();
    const [messages, setMessages] = useState([]); // Local state for messages
    const messageEndRef = useRef(null);
    const allMessages = useSelector(state => state.message?.ReceivedMessage); // Fetched messages from backend
    const currentUser = useSelector(state => state.auth?.auth); // Current logged-in user
    const receivedUser = useSelector(state => state.auth?.receivedUser); 
    // Fetch previous messages when component mounts
    useEffect(() => {
        const fetchData = async () => {
            await dispatch(markMessagesAsRead({ senderId: id, chatType: 'one' }));
            await dispatch(getUnreadMessage());
            setTimeout(scrollToBottom, 100);
        };
    
        dispatch(ReceiveOneToOne(id)); 
        dispatch(GetUser(id));
        fetchData();
    }, [id, dispatch]);
    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Update local messages state when Redux messages change
    useEffect(() => {
        setMessages(allMessages || []);
        setTimeout(scrollToBottom, 100);
    }, [allMessages]);

    useEffect(() => {
        if (currentUser && currentUser._id) {
            socket.emit('joinRoom', currentUser._id); // Join room with user's own ID
            console.log(`User joined room: ${currentUser._id}`);
        }
    }, [currentUser]);

    useEffect(() => {
        console.log("Setting up socket listener for 'receiveMessage'");
        socket.on('receiveMessage', (newMessage) => {
            if (newMessage.sender === id || newMessage.receiver === id) {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                scrollToBottom()
    
                if (newMessage.receiver === currentUser._id) {
                    dispatch(markMessagesAsRead({ senderId: newMessage.sender ,chatType:'one'}));
                }
            }
        });
    
        return () => {
            console.log("Cleaning up socket listener for 'receiveMessage'");
            socket.off('receiveMessage');
        };
    }, [id, currentUser._id, dispatch]);

    return (
        <div className=''>
            <div className='w-[80vw] h-[7vh] fixed top-0 right-0 bg-white px-5 flex items-center'>
                <h2>{receivedUser?.username}</h2>
            </div>
            <div className='md:w-[80vw] w-screen md:h-[80vh] h-[80vh] bg-gray-200 p-4 overflow-y-scroll mt-[7vh] md:ms-[20vw]'>
                {messages && messages.length > 0 ? (
                    messages.map((message, idx) => (
                        <div
                            key={idx}
                            className={`mb-4 flex ${message.sender === currentUser._id ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`p-3 rounded-lg max-w-[60%] ${
                                message.sender === currentUser._id ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
                            }`}>
                                <p>{message.content}</p>

                                {/* File handling */}
                                {message.fileUrl && (
                                    <div className="file-content mt-2">
                                        {message.fileType && message.fileType.startsWith('image/') ? (
                                            <img 
                                                src={message.fileUrl} 
                                                alt={message.originalFileName || 'Uploaded file'} 
                                                className="max-w-full max-h-64 rounded"
                                            />
                                        ) : (
                                            <a 
                                                href={message.fileUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className={`${ message.sender === currentUser._id? "text-blue-200" : "text-blue-500"} underline break-words`}
                                            >
                                                {message.originalFileName || 'Download'} (Download)
                                            </a>
                                        )}
                                    </div>
                                )}
                                
                                <p className="text-xs mt-2">
                                    {moment(message.timestamp).format('DD/MM/YYYY, h:mm A')}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='text-3xl w-full h-full text-white font-bold flex justify-center items-center'>
                        <img src={image} alt="" />
                        {/* <p>No messages yet...</p> */}
                        </div>
                )}
            <div ref={messageEndRef} />
            </div>
            <div className='h-[15vh] bg-white fixed md:left-[20vw] md:w-[80vw] w-full flex justify-center items-center bottom-0'>            <SendMessage socket={socket} receiverId={id} setMessages={setMessages} scrollToBottom={scrollToBottom}/> </div>
        </div>
    );
};

export default Chats;