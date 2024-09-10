import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllMessages } from '../features/messages/messageSlice';

const AllMessages = () => {
    const dispatch = useDispatch();
    const allMessages = useSelector(state => state.message?.allMessages); // Assuming you store messages in the Redux store

    useEffect(() => {
        dispatch(getAllMessages());
    }, [dispatch]);

    return (
        <div className='p-4'>
            <h2 className='text-xl font-bold mb-4'>All Messages</h2>

            <div className='bg-white shadow-md rounded-md overflow-hidden'>
                {allMessages?.length > 0 ? (
                    allMessages.map((message, idx) => (
                        <div
                            key={idx}
                            className={`p-4 border-b-2 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                        >
                            <div className='flex justify-between mb-2'>
                                <div className='font-bold text-blue-500'>
                                    {message?.sender?.username} → {message?.receiver?.username}
                                </div>
                                <div className='text-sm text-gray-500'>{new Date(message.timestamp).toLocaleString()}</div>
                            </div>
                            <div className='text-gray-800'>
                                {message.content}
                            </div>
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
                                                
                                            >
                                                {message.originalFileName || 'Download'} (Download)
                                            </a>
                                        )}
                                    </div>
                                )}
                        </div>
                    ))
                ) : (
                    <div className='p-4 text-center text-gray-500'>No messages to display</div>
                )}
            </div>
        </div>
    );
};

export default AllMessages;
