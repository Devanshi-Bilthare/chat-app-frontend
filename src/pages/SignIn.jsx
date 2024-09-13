import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Login } from "../features/auth/authSlice";
import Image from '../assets/signup.png'

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated,navigate]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault(); 
    dispatch(Login(formData));
  };


  return (
    <div className="w-full h-screen flex md:flex-row flex-col justify-center items-center">
      <img className='h-[30vh] md:h-auto' src={Image} alt="" />
      <form onSubmit={submitHandler} className="md:w-[30%] w-[90%] border rounded-xl p-4">
        <label htmlFor="username">Enter Username</label>
        <input
          className="w-full border rounded-xl p-2 mb-4 mt-1"
          type="text"
          name="username"
          id="username"
          placeholder="username"
          value={formData.username} 
          onChange={handleChange}
        />
        <label htmlFor="password">Enter Password</label>
        <input
          className="w-full border rounded-xl p-2 mb-4 mt-1"
          type="text"
          name="password"
          id="password"
          placeholder="******"
          value={formData.password} 
          onChange={handleChange} 
        />
        <button type="submit" className="w-full border p-2 rounded-xl bg-black text-white">
          Login
        </button>
      </form>
    </div>
  );
};

export default SignIn;
