import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SendOneToOne } from '../features/messages/messageSlice'; // Assuming your redux action can handle groups too
import { AiOutlineFile } from 'react-icons/ai';
import { v4 as uuidv4 } from 'uuid';

const SendMessage = ({ socket, receiverId, roomId, setMessages }) => {
    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null);
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.auth?.auth);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSendMessage = async () => {
        if (message.trim() || file) {
            const formData = new FormData();
            formData.append('content', message);
            formData.append('sender', currentUser._id);
    
            if (roomId) {
                formData.append('room', roomId);
            } else {
                formData.append('receiverId', receiverId);
            }
    
            if (file) {
                formData.append('file', file);
            }
    
            try {
                const result = await dispatch(SendOneToOne(formData)).unwrap();
    
                const messageId = uuidv4();
                const newMessage = {
                    uniqueId: messageId,
                    content: message,
                    sender:roomId ? currentUser :  currentUser._id,
                    receiver: receiverId || null,
                    room: roomId || null,
                    fileUrl: file ? URL.createObjectURL(file) : null,
                    timestamp: new Date(),
                };
    
                socket.emit('sendMessage', newMessage);
    
                setMessages((prevMessages) => [...prevMessages, newMessage]);
    
                setMessage('');
                setFile(null);
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    };
    
    
    return (
        <div className="fixed bottom-2 right-20 w-[70vw] border-2 border-gray-300 pe-10 rounded-xl bg-white">
            <div className="flex items-center space-x-2">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full p-2  border-none outline-none border-gray-300 rounded-md resize-none"
                ></textarea>

                <label htmlFor="file-input">
                    <AiOutlineFile className="text-2xl cursor-pointer" />
                </label>
                <input
                    type="file"
                    id="file-input"
                    className="hidden"
                    onChange={handleFileChange}
                />

                <button
                    onClick={handleSendMessage}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    Send
                </button>
            </div>

            {file && (
                <div className="mt-2 text-sm text-gray-600">
                    <p>Selected File: {file.name}</p>
                </div>
            )}
        </div>
    );
};

export default SendMessage;
