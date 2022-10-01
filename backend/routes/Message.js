import express from 'express';
import Message from '../models/MessageModel.js'

const MessageRoute = express.Router()

//add

MessageRoute.post('/', async (req, res)=> {
    const newMessage = new Message(req.body) 
    try {
        const savedMessage = await newMessage.save()
        res.status(200).json(savedMessage)
    } catch (error) {
        res.status(500).json(error)
    }
})

// gat

MessageRoute.get('/:conversationId', async (req, res)=> {
    try {
        const messagess = await Message.find({
            conversationId: req.params.conversationId
        })
        res.status(200).json(messagess)
    } catch (error) {
        res.status(500).json({error: 'could not get messages'})
    }
})


export default MessageRoute