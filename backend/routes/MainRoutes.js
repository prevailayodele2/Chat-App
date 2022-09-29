import data from "../data.js";
import express from "express"
import User from "../models/UserModel.js";

const mainRoutes = express.Router()

mainRoutes.get('/', async (req, res) => {
    await User.deleteOne({})
    const  createdUser = await User.insertMany(data.user);

    res.send({createdUser})
})

export default mainRoutes