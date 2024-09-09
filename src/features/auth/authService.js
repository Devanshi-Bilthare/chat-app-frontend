import axios from "axios";
import { base_url } from "../../utils/base_url";
import { config } from "../../utils/config";


const Register = async (formData)=>{
    const response = await axios.post(`${base_url}user/register`,formData)
    // localStorage.setItem('user',JSON.stringify(response.data))
    return response.data   
}

const Login = async (formData)=>{
    const response = await axios.post(`${base_url}user/login`,formData)
    localStorage.setItem('user',JSON.stringify(response.data))
    return response.data
}

const GetAll = async ()=>{
    const response = await axios.get(`${base_url}user/getAll`)
    return response.data
}

const GetUser = async (id)=>{
    const response = await axios.get(`${base_url}user/getUser/${id}`)
    return response.data
}

const authService = {Register,Login,GetAll,GetUser}

export default authService
