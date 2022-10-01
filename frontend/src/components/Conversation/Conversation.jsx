import axios from 'axios'
import React, { useEffect, useState } from 'react'
import './conversation.css'

const Conversation = ({conversation, currentUser}) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const friendId = conversation.members.find((m)=> m !== currentUser._id )
    const getUser = async () => {
      try {
        const res = await axios.get('http://localhost:8800/api/users?userId='+friendId)
        setUser(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    getUser()
  },[currentUser, conversation])
  return (
    <>
       <div className="conversation">
           <img src={user?.profilePicture || '/assets/person/noAvatar.png' } alt="" className="conversationImg" />
           <span className="conversationName">{user?.username}</span>
       </div>
    </>
  )
}

export default Conversation