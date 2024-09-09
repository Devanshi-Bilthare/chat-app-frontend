import {createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "./authService";
import { toast } from "react-toastify";

const loadUserFromLocalStorage = () => {
    const user = localStorage.getItem('user');
    console.log(user)
    return user ? JSON.parse(user) : null;
};

export const Register = createAsyncThunk('user/register',async(formData,thunkApi)=>{
    try{
        return await authService.Register(formData)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const Login = createAsyncThunk('user/login',async(formData,thunkApi)=>{
    try{
        return await authService.Login(formData)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const GetAll = createAsyncThunk('user/getAll',async(thunkApi)=>{
    try{
        return await authService.GetAll()
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const GetUser = createAsyncThunk('user/getUser',async(id,thunkApi)=>{
    try{
        return await authService.GetUser(id)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

const initialState = {
    auth:loadUserFromLocalStorage(),
    isAuthenticated: !!loadUserFromLocalStorage(),
    isError:false,
    isSuccess:false,
    isLoading:false,
    message:""
}
export const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(Register.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(Register.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.user = action.payload
            if(state.isSuccess){
                toast.success("User Registered successfully")
            }
        })
        .addCase(Register.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.message = action.error
            if(state.isError){
                toast.error(action.payload.response.data.message)
            }
        })
        .addCase(Login.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(Login.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.auth = action.payload
             state.isAuthenticated = true;
            if(state.isSuccess){
                toast.success("User Logged In successfully")
            }
        })
        .addCase(Login.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.message = action.error
            if(state.isError){
                toast.error(action.payload.response.data.message)
            }
        })
        .addCase(GetAll.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(GetAll.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.allUsers = action.payload
        })
        .addCase(GetAll.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.message = action.error
        })
        .addCase(GetUser.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(GetUser.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.receivedUser = action.payload
        })
        .addCase(GetUser.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.message = action.error
        })
    }
})

export default authSlice.reducer