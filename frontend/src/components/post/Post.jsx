import "./post.css";
import { MoreVert } from "@mui/icons-material";
//import { Users } from "../../dummyData";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {Link} from 'react-router-dom'
import { format} from 'timeago.js'
import { AuthContext } from "../../context/AuthContext";

export default function Post({ userid, likes, ID, desc, created, image}) {
  const [like,setLike] = useState(likes.length)
  const [user,setUser] = useState([])
  const [isLiked,setIsLiked] = useState(false)
  const { user: currentUser } = useContext(AuthContext);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER

  useEffect(() => {
    setIsLiked(likes.includes(currentUser._id));
  }, [currentUser._id, likes]);


  
  const likeHandler =()=>{
    try {
      axios.put("http://localhost:8800/api/posts/" + ID + "/like", { userId: currentUser._id });
    } catch (err) {}
    setLike(isLiked ? like-1 : like+1)
    setIsLiked(!isLiked) 
  }

  useEffect(()=>  {
    const fetchUser = async () => {
      const res = await axios.get(`http://localhost:8800/api/users?userId=${userid}`)
      setUser(res.data)
    }
    fetchUser()
  },[userid])

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
          <Link to={`profile/${user.username}`}>
            <img
              className="postProfileImg"
              src={user.profilPicture ? PF + user.profilPicture : "/assets/person/noAvatar.png" }
              alt=""
            />
            </Link>
            <span className="postUsername">
              {user.username}
            </span>
            <span className="postDate">{format(created)}</span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{desc}</span>
          <img className="postImg" src={`http://localhost:8800/images/`+image} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img className="likeIcon" src={`${PF}like.png`} onClick={likeHandler} alt="" />
            <img className="likeIcon" src={`${PF}heart.png`} onClick={likeHandler} alt="" />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
