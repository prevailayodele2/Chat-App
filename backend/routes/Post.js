import express from 'express';
import Post from '../models/PostModels.js';
import User from '../models/UserModel.js';

const PostRoute = express.Router();
//Create
PostRoute.post('/', async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json(error);
  }
});
//Update
PostRoute.put('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json('your post has been edited Sucessfully');
    } else {
      res.status(401).json('you can only edit your post');
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
//delete
PostRoute.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne({ $set: req.body });
      res.status(200).json('your post has been deleted Sucessfully');
    } else {
      res.status(401).json('you can only delete your post');
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
//Like
PostRoute.put('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json('the Post has been liked');
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json('the Post has been disliked');
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
//get a post
PostRoute.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
});

// det timeline
PostRoute.get('/timeline/all', async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPost = await Promise.all(
      currentUser.following.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.json(userPosts.concat(...friendPost));
  } catch (error) {
    res.status(500).json(error);
  }
});

export default PostRoute;
