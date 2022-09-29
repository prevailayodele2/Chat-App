import Post from '../post/Post';
import Share from '../share/Share';
import './feed.css';
//import { Posts } from "../../dummyData";
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

export default function Feed({ username }) {
  const [post, setPost] = useState([]);

  const { user } = useContext(AuthContext);
  useEffect(() => {
    const fetchPost = async () => {
      const res = username
        ? await axios.get('http://localhost:8800/api/posts/profile/' + username)
        : await axios.get(
            'http://localhost:8800/api/posts/timeline/all/' + user._id
          );
          setPost(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchPost();
  }, [username, user._id]);

  console.log(post);
  return (
    <div className="feed">
      <div className="feedWrapper">
      {(!username || username === user.username) && <Share />}
        {post.map((p, i) => (
          <>
            <div key={i}>
              <Post
                userid={p.userId}
                ID={p._id}
                image={p.image}
                likes={p.likes}
                desc={p.desc}
                created={p.createdAt}
              />
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
