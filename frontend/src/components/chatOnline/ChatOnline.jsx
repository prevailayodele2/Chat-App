import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './chatOnline.css';

const ChatOnline = ({ onlineUsers, currentId, setCurrentChat }) => {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get(
        `http://localhost:8800/api/users/friends/` + currentId
      );
      setFriends(res.data);
    };
    getFriends();
  }, [currentId]);

  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
  }, [friends, onlineUsers]);

  const handleClick = async (o) => {
     try {
       const res = await axios.get(`http://localhost:8800/api/conversations/find/${currentId}/${o._id}`)
       setCurrentChat(res.data)
     } catch (error) {
       console.log(error)
     }
  }

  return (
    <>
      <div className="chatOnline">
        {onlineFriends.map((o) => (
          <div className="chatOnlineFriend" onClick={()=> handleClick(o)}>
            <div className="chatOnlineImgContainer">
              <img
                src={
                  o?.profilePicture
                    ? o.profilePicture
                    : '/assets/person/noAvatar.png'
                }
                alt=""
                className="chatOnlineImg"
              />
              <div className="chatOnlineBadge"></div>
            </div>
            <span className="chatOnlineName">{o?.username}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default ChatOnline;

