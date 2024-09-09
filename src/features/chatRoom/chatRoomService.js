import axios from "axios";
import { base_url } from "../../utils/base_url";
import { config } from "../../utils/config";


const CreateChatRoom = async (data)=>{
    const response = await axios.post(`${base_url}chatRoom/`,data,config)
    return response.data   
}

const getUserChatRoom = async(id) =>{
    const response = await axios.get(`${base_url}chatRoom/${id}/userroom`,config)
    return response.data   
}

const getCurrentChatRoom = async(id) =>{
    const response = await axios.get(`${base_url}chatRoom/${id}`,config)
    return response.data   
}



const chatRoomService = {CreateChatRoom,getUserChatRoom,getCurrentChatRoom}

export default chatRoomService
