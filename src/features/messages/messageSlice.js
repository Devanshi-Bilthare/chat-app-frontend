import {createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import messageService from "./messageService";

export const ReceiveOneToOne = createAsyncThunk('message/receive',async(id,thunkApi)=>{
    try{
        return await messageService.ReceiveOneToOne(id)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const SendOneToOne = createAsyncThunk('message/send-one-to-one',async(id,thunkApi)=>{
    try{
        return await messageService.SendOneToOne(id)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const ReceiveGroupMessages = createAsyncThunk('message/receive/group',async(id,thunkApi)=>{
    try{
        return await messageService.ReceiveGroupMessages(id)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})


export const markMessagesAsRead = createAsyncThunk('message/mark-message-asRead',async(data,thunkApi)=>{
    try{
        return await messageService.markMessagesAsRead(data)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const getUnreadMessage = createAsyncThunk('message/unreadMsg',async(thunkApi)=>{
    try{
        
        return  await messageService.getUnreadMessage()
      
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})



const initialState = {
    messages:null,
    isError:false,
    isSuccess:false,
    isLoading:false,
    message:""
}
export const messageSlice = createSlice({
    name:"messages",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(ReceiveOneToOne.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(ReceiveOneToOne.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.ReceivedMessage = action.payload
        })
        .addCase(ReceiveOneToOne.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.message = action.error
        })
        .addCase(SendOneToOne.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(SendOneToOne.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.SendedMessageOneToOne = action.payload
        })
        .addCase(SendOneToOne.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.message = action.error
        })
        .addCase(ReceiveGroupMessages.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(ReceiveGroupMessages.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.groupMessages = action.payload
        })
        .addCase(ReceiveGroupMessages.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.message = action.error
        })
        .addCase(markMessagesAsRead.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(markMessagesAsRead.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.markMessageasread = action.payload
        })
        .addCase(markMessagesAsRead.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.message = action.error
           
        })
        .addCase(getUnreadMessage.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(getUnreadMessage.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.unreadMessage = action.payload
            // console.log(state.unreadMessage)
        })
        .addCase(getUnreadMessage.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.message = action.error
        })
       
        
    }
})

export default messageSlice.reducer