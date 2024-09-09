import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CreateChatRoom } from '../features/chatRoom/chatRoomSlice';
import { useNavigate } from 'react-router-dom';

const CreateGroup = () => {
    const [name, setName] = useState('');
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const userList = useSelector(state => state.auth.allUsers); // Get users from the redux state

    // Filter users based on the search term
    const filteredUsers = userList.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(CreateChatRoom({ name, members }));

    };

    const handleMemberChange = (e) => {
        const { value, checked } = e.target;

        // Update members list based on checkbox state
        if (checked) {
            setMembers(prevMembers => [...prevMembers, value]);
        } else {
            setMembers(prevMembers => prevMembers.filter(member => member !== value));
        }
    };

    return (
        <div className='absolute w-screen h-screen bg-black/30 backdrop-blur-sm flex justify-center items-center'>
            <form className='w-[50vw] h-[70vh] bg-white rounded-xl p-6 flex flex-col' onSubmit={handleSubmit}>
                <h2 className='text-lg font-bold mb-4'>Create Chat Room</h2>
                
                <div className='mb-4'>
                    <label htmlFor='name' className='block text-sm font-medium text-gray-700'>Chat Room Name</label>
                    <input
                        type='text'
                        id='name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='mt-1 p-2 border border-gray-300 rounded-md w-full'
                        required
                    />
                </div>

                <div className='mb-4'>
                    <label htmlFor='search' className='block text-sm font-medium text-gray-700'>Search Users</label>
                    <input
                        type='text'
                        id='search'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='mt-1 p-2 border border-gray-300 rounded-md w-full'
                        placeholder='Search users...'
                    />
                </div>

                <div className='mb-4 flex-grow'>
                    <label htmlFor='members' className='block text-sm font-medium text-gray-700'>Select Members</label>
                    <ul id='members' className='mt-2 max-h-[20vh] custom-scroll overflow-y-auto'>
                        {filteredUsers.map(user => (
                            <li key={user._id} className='flex items-center mb-2'>
                                <input
                                    type='checkbox'
                                    id={`user-${user._id}`}
                                    value={user._id}
                                    checked={members.includes(user._id)}
                                    onChange={handleMemberChange}
                                    className='mr-2'
                                />
                                <label htmlFor={`user-${user._id}`} className='text-sm text-gray-700'>
                                    {user.username}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>

                <button
                    type='submit'
                    className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
                >
                    Create Chat Room
                </button>
            </form>
        </div>
    );
};

export default CreateGroup;
