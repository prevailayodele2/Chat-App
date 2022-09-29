import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/UserModel.js';

const UserRouter = express.Router();

//updateUser
UserRouter.put('/:id', async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(400).json('an error occured');
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json('account has been updated');
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(400).json('you can update only your account!');
  }
});
//deleteUser
UserRouter.delete('/:id', async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete({ _id: req.params.id });
      res.status(200).json('account has been deleted!!');
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(400).json('you can delete only your account!');
  }
});
//get a user
UserRouter.get('/', async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get friends
UserRouter.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.following.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList)
  } catch (err) {
    res.status(500).json(err);
  }
});

//follow a user

UserRouter.put('/:id/follow', async (req, res) => {
  const { userId } = req.body;
  if (userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(userId);
      if (!user.followers.includes(userId)) {
        await user.updateOne({ $push: { followers: userId } });
        await currentUser.updateOne({ $push: { following: req.params.id } });

        res.status(200).json('user has been followed');
      } else {
        res.status(403).json('you are already following the usr');
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(500).json('you cant follow your self');
  }
});
//Un follow
UserRouter.put('/:id/unfollow', async (req, res) => {
  const { userId } = req.body;
  if (userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(userId);
      if (user.followers.includes(userId)) {
        await user.updateOne({ $pull: { followers: userId } });
        await currentUser.updateOne({ $pull: { following: req.params.id } });

        res.status(200).json('user has been unfollowed');
      } else {
        res.status(403).json('you dont follow this usr');
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(500).json('you cant follow your self');
  }
});

export default UserRouter;
