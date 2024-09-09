import axios from "axios";
import { base_url } from "../../utils/base_url";
import { config } from "../../utils/config";


const ReceiveOneToOne = async (id)=>{
    const response = await axios.get(`${base_url}messages/oneToOne/${id}`,config)
    return response.data   
}

const SendOneToOne = async (data)=>{
    const response = await axios.post(`${base_url}messages/`,data,config)
    return response.data   
}


const ReceiveGroupMessages = async (id)=>{
    const response = await axios.get(`${base_url}messages/group/${id}`,config)
    return response.data   
}

const getUnreadMessage = async ()=>{
    const response = await axios.get(`${base_url}messages/unread`,config)
    return response.data   
}

const markMessagesAsRead = async (data) => {
    const response = await axios.post(`${base_url}messages/markMsgRead`, data, config);
    return response.data;
}


const messageService = {ReceiveOneToOne,SendOneToOne,ReceiveGroupMessages,markMessagesAsRead,getUnreadMessage}

export default messageService
