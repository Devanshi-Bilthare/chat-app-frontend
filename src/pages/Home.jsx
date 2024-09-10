import React, { useState } from 'react'
import ChatList from '../Components/ChatList'
import { Outlet } from 'react-router-dom'
import Chats from '../Components/Chats'
import CreateGroup from '../Components/CreateGroup'

const Home = () => {
  const [isCreateGroup,setIsCreateGroup] = useState(false)

  return (
    <div className='flex bg-gray-200 relative overflow-x-hidden w-screen'>
        <ChatList setIsCreateGroup={setIsCreateGroup}/>
        <Outlet>
            <Chats/>
        </Outlet>
        {isCreateGroup ? <CreateGroup/> : null}
    </div>
  )
}

export default Home