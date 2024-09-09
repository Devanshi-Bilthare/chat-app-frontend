import {createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import chatRoomService from "./chatRoomService";

export const CreateChatRoom = createAsyncThunk('chatroom/create',async(data,thunkApi)=>{
    try{
        return await chatRoomService.CreateChatRoom(data)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const GetUserChatRoom = createAsyncThunk('chatRoom/user',async(id,thunkApi)=>{
    try{
        return await chatRoomService.getUserChatRoom(id)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const getCurrentChatRoom = createAsyncThunk('chatRoom/current',async(id,thunkApi)=>{
    try{
        return await chatRoomService.getCurrentChatRoom(id)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

const initialState = {
    chatRoom:null,
    isError:false,
    isSuccess:false,
    isLoading:false,
    message:""
}
export const chatRoomSlice = createSlice({
    name:"chatRoom",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(CreateChatRoom.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(CreateChatRoom.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.CreatedChatRoom = action.payload
            if(state.isSuccess){
            toast.success('group created')
            window.location.reload()
            }  
        })
        .addCase(CreateChatRoom.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.message = action.error
            toast.error(action.payload.response.data.message)
        })
        builder.addCase(GetUserChatRoom.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(GetUserChatRoom.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.chatRooms = action.payload
        })
        .addCase(GetUserChatRoom.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.message = action.error
        })
        builder.addCase(getCurrentChatRoom.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(getCurrentChatRoom.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.currentChatRoom = action.payload
        })
        .addCase(getCurrentChatRoom.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.message = action.error
        })
        
        
    }
})

export default chatRoomSlice.reducer