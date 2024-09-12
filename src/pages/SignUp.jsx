import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Register } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        storePassword: '' // Add storePassword to the state
    });

    const { isSuccess } = useSelector(state => state.auth);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prevState => ({
            ...prevState,
            [name]: value,
            // If the field being changed is 'password', also update 'storePassword'
            ...(name === 'password' && { storePassword: value })
        }));
    };

    const submitHandler = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        dispatch(Register(formData));
        navigate('/');
    };

    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <form onSubmit={submitHandler} className='md:w-[30%] w-[90%] border rounded-xl p-4'>
                <label htmlFor="username">Enter Username</label>
                <input 
                    className='w-full border rounded-xl p-2 mb-4 mt-1' 
                    type="text" 
                    name='username' 
                    id='username' 
                    placeholder='username'
                    value={formData.username} // Controlled input
                    onChange={handleChange} // Update state on change
                />
                <label htmlFor="password">Enter Password</label>
                <input 
                    className='w-full border rounded-xl p-2 mb-4 mt-1' 
                    type="password" 
                    name='password' 
                    id='password' 
                    placeholder='******'
                    value={formData.password} // Controlled input
                    onChange={handleChange} // Update state on change
                />
                <button 
                    className='w-full border p-2 rounded-xl bg-black text-white'
                    type="submit" // Ensure button type is submit
                >
                    SignUp
                </button>
            </form>
        </div>
    );
};

export default SignUp;
