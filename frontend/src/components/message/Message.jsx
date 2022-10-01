import React from 'react'
import './message.css'
import {format} from 'timeago.js'

const Message = ({message,own}) => {
  return (
    <>
        <div className={own ? 'message own' : "message"}>
            <div className="messageTop">
                <img src="/assets/post/9.jpeg" alt="" className="messageImg" />
                <span className="messageText">{message.text}</span>
            </div>
            <div className="messageBottom">{format(message.createdAt)}</div>
        </div>
    </>
  )
}

export default Message