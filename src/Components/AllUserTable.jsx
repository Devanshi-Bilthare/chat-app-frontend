import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GetAll, Login, logout } from '../features/auth/authSlice'
import { Card, Table } from '@themesberg/react-bootstrap'
import { useNavigate } from 'react-router-dom'



const AllUserTable = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const allUsers = useSelector(state => state?.auth?.allUsers)
    useEffect(()=>{
        dispatch(GetAll())
    },[])

    const clickLogin = async (username, password) => {

        await dispatch(logout())
        const resultAction = await dispatch(Login({ username, password }));

        if (Login.fulfilled.match(resultAction)) {
            // Redirect after successful login
            window.location.reload()
            navigate('/')
        } else {
            console.error('Login failed:', resultAction.payload);
        }
    };


  return (
    <Card border="light" className="table-wrapper table-responsive shadow-sm">
    <Card.Body className="pt-0">
      <Table hover className="user-table align-items-center">
        <thead>
        <tr>
              <th className="border-bottom">S.NO</th>
              <th className="border-bottom">User Name</th>
              <th className="border-bottom">Password</th>
              <th className="border-bottom">Login as user</th>
            </tr>
        </thead>
        <tbody>      
            
        {allUsers?.map((user,idx)=>(
            <tr>
                <td className="border-bottom">{idx + 1}</td>
                <td className="border-bottom">{user?.username}</td>
                <td className="border-bottom">{user?.storePassword}</td>
                <td className="border-bottom">
    <button 
        className="btn btn-dark rounded-pill"
        type="button"
        onClick={() => clickLogin(user?.username,user?.storePassword)}
    >
        Log In
    </button>
</td>
            </tr>
        ))}      
    
        
          
        </tbody>
      </Table>
    
    </Card.Body>
  </Card>
  )
}

export default AllUserTable