import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
   userId: {type: String, required: true},
   desc: {type: String},
   image: {type: String},
   likes: {type: Array, default: []},
},{timestamps: true})

const Post = mongoose.model('Post', PostSchema)
export default Post

