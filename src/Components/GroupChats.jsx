import React, { useEffect, useState } from 'react'
import SendMessage from './SendMessage'
import { useDispatch, useSelector } from 'react-redux';
import { markMessagesAsRead, ReceiveGroupMessages } from '../features/messages/messageSlice';
import { getCurrentChatRoom } from '../features/chatRoom/chatRoomSlice';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import socket from '../utils/socket';
import image from '../assets/image.png'

const GroupChats = () => {
  const params = useParams();
  const id = params.id; // Room ID
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]); // Local state for messages

  const allMessages = useSelector(state => state.message?.groupMessages); // Fetched messages from backend
  const currentUser = useSelector(state => state.auth?.auth);
  const currentChatRoom = useSelector(state => state.chatRoom?.currentChatRoom);
  
  // Fetch previous messages when component mounts
  useEffect(() => {
    dispatch(ReceiveGroupMessages(id)); 
    dispatch(getCurrentChatRoom(id));
    dispatch(markMessagesAsRead({ senderId: id,chatType:'group'}));
  }, [id, dispatch]);

  // Update local messages state when Redux messages change
  useEffect(() => {
    setMessages(allMessages || []);
  }, [allMessages]);

  // Join room when currentChatRoom is available
  useEffect(() => {
    if (currentChatRoom && currentChatRoom._id) {
      socket.emit('joinRoom', currentChatRoom._id); // Join room with room ID
      console.log(`User joined room: ${currentChatRoom._id}`);
    }
  }, [currentChatRoom]);

  // Handle receiving messages in real-time from Socket.IO
  useEffect(() => {
    socket.on('receiveMessage', (newMessage) => {
      // Make sure the message is coming from the current room
      if (newMessage.room === currentChatRoom._id) {
        // Check if the message is from the current user (avoid adding it twice)
        if (newMessage.sender?._id !== currentUser._id) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
          dispatch(markMessagesAsRead({ senderId: newMessage.room ,chatType:'group'}));
        
        }
       
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [currentChatRoom]);

  return (
    <div className=''>
      <div className='w-[80vw] h-[7vh] fixed top-0 right-0 bg-white px-5 flex items-center gap-5'>
        <p className='capitalize'>{currentChatRoom?.name} - </p>
        {currentChatRoom?.members?.map((member) => (
          <p key={member._id}>{member.username},</p>
        ))}
      </div>
      <div className='md:w-[80vw] w-[full] h-[80vh] bg-gray-200 p-4 overflow-y-scroll mt-[7vh] md:ms-[20vw]'>
        {messages && messages.length > 0 ? (
          messages.map((message, idx) => (
            <div
              key={idx}
              className={`mb-4 flex ${message.sender?._id === currentUser._id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`p-3 rounded-lg max-w-[60%] ${
                message.sender?._id === currentUser._id ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
              }`}>
                <p className="text-xs mb-2">{message.sender?.username}</p>
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
                        className={`${
                          message.sender?._id === currentUser._id ? 'text-blue-200' : 'text-blue-500'
                        } underline break-words`}
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
      </div>
      {/* SendMessage remains unchanged */}
      <div className='h-[15vh] bg-white fixed md:left-[20vw] md:w-[80vw] w-full flex justify-center items-center bottom-0'>   
      <SendMessage socket={socket} roomId={id} setMessages={setMessages}/> 
      </div>
    </div>
  );
};

export default GroupChats;