import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import ChatOnline from '../../components/chatOnline/ChatOnline';
import Conversation from '../../components/Conversation/Conversation';
import Message from '../../components/message/Message';
import Topbar from '../../components/topbar/Topbar';
import { AuthContext } from '../../context/AuthContext';
import './messages.css';
import { io } from 'socket.io-client';

const Messages = () => {
  const [conversation, setConversation] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messagess, setMessagess] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const scrollRef = useRef();
  const socket = useRef();

  const { user } = useContext(AuthContext);

  useEffect(() => {
    socket.current = io('ws://localhost:8900');
    socket.current.on('getMessage', (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessagess((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit('addUser', user._id);
    socket.current.on('getUsers', (users) => {
      setOnlineUsers(
        user.following.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [user]);

  useEffect(() => {
    const getConverstion = async () => {
      try {
        const res = await axios.get(
          'http://localhost:8800/api/conversations/' + user._id
        );
        console.log(res.data);
        setConversation(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getConverstion();
  }, [user._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(
          'http://localhost:8800/api/messages/' + currentChat?._id
        );
        setMessagess(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socket.current.emit('sendMessage', {
      senderId: user._id,
      receiverId: receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post(
        'http://localhost:8800/api/messages',
        message
      );
      setMessagess([...messagess, res.data]);
      setNewMessage('');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagess]);

  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="Search for Friends" className="chatMenuInput" />
            {conversation.map((a) => (
              <div onClick={() => setCurrentChat(a)}>
                <Conversation conversation={a} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messagess.map((m) => (
                    <div ref={scrollRef}>
                      <Message message={m} own={m.sender === user._id} />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    placeholder="Enter Message..."
                    className="chatMessageInput"
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a Conversation to Start
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user._id}
              setCurrentChat={setCurrentChat}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Messages;
