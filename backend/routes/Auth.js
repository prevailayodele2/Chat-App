import express from 'express';
import User from '../models/UserModel.js';
import bcrypt from 'bcrypt';

const Auth = express.Router();

//REgiSTer

Auth.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json('An error occured');
  }
});

//LOGIN

Auth.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    !user && res.status(404).json('User Not Found');

    const validPassword = await bcrypt.compare(password, user.password)
    !validPassword && res.status(400).json('wrong Password')

    res.status(200).json(user)

  } catch (error) {
    res.status(400).json('Something Went Wrong');
  }
});

export default Auth;
