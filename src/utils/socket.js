import io from 'socket.io-client';

const socket = io('http://localhost:5000/'); // Replace with your backend URL
// const socket = io("https://chat-app-backend-1-9tqg.onrender.com/")

export default socket;