import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true,},
    email: {type: String, required: true, unique: true },
    password: {type: String, required:true, unique: true},
    profilePicture: {type: String, default: "" },
    coverPicture: {type: String, default: "" },
    followers: {type: Array, default: []},
    following: {type: Array, default: []},
    desc: {type: String },
    city: {type: String},
    from: {type: String},
    relationship: {type: Number, enum: [1,2,3]},
    isAdmin: {type: Boolean,default: false}
},{timestamps: true})

const User = mongoose.model('User', UserSchema)
export default User

