import React, { useState } from 'react'
import ChatList from '../Components/ChatList'
import { Outlet } from 'react-router-dom'
import Chats from '../Components/Chats'
import CreateGroup from '../Components/CreateGroup'

const Home = () => {
  const [isCreateGroup,setIsCreateGroup] = useState(false)

  return (
    <div className='flex bg-gray-200 relative'>
        <ChatList setIsCreateGroup={setIsCreateGroup}/>
        <Outlet>
            <Chats/>
        </Outlet>
        {isCreateGroup ? <CreateGroup setIsCreateGroup={setIsCreateGroup}/> : null}
    </div>
  )
}

export default Home