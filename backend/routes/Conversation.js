import express from 'express';
import Conversation from '../models/ConversationModel.js';

const ConversationRoute = express.Router();

//new cov
ConversationRoute.post('/', async (req, res) => {
  const newConverstion = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const savedConverstion = await newConverstion.save();
    res.status(200).json(savedConverstion);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get conv

ConversationRoute.get('/:userId', async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ error: 'can not find conversation' });
  }
});

ConversationRoute.get('/find/:firstUserId/:secondUserId', async (req, res) => {
  try {
     const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
     })
     res.status(200).json(conversation)
  } catch (error) {
    res.status(500).json({error: "could not get user"})
  }
})

export default ConversationRoute;
