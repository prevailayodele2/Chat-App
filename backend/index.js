import express from "express"
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import helmet from 'helmet'
import morgan from 'morgan'
import UserRouter from "./routes/users.js"
import Auth from "./routes/Auth.js"
import PostRoute from "./routes/Post.js"
import cors from 'cors'
import mainRoutes from "./routes/MainRoutes.js"
import path from 'path'
import multer from 'multer'
import {fileURLToPath} from 'url';
import ConversationRoute from "./routes/Conversation.js"
import MessageRoute from "./routes/Message.js"


dotenv.config()

const app = express() 

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

mongoose.connect(process.env.MONGODG_URL).then(() => {
    console.log('DB Connection Successfull')        
  }).catch((err) => {
    console.log(err.message)
  })

app.use(express.json())
app.use(express.urlencoded({ extended: true}))


app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use(cors())
app.use(helmet())
app.use(morgan('common'))


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

app.use('/api/main', mainRoutes)
app.use('/api/users', UserRouter )
app.use('/api/auth', Auth)
app.use('/api/posts', PostRoute)
app.use('/api/messages', MessageRoute)
app.use('/api/conversations', ConversationRoute)

const port = process.env.PORT || 8800
app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`)
})