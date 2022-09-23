import express from "express"
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import helmet from 'helmet'
import morgan from 'morgan'
import UserRouter from "./routes/users.js"
import Auth from "./routes/Auth.js"
import PostRoute from "./routes/Post.js"


dotenv.config()

const app = express() 

mongoose.connect(process.env.MONGODG_URL).then(() => {
    console.log('DB Connection Successfull')
  }).catch((err) => {
    console.log(err.message)
  })

app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use(helmet())
app.use(morgan('common'))

app.use('/api/users', UserRouter )
app.use('/api/auth', Auth)
app.use('/api/posts', PostRoute)

const port = process.env.PORT || 8800
app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`)
})