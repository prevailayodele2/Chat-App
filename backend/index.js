import express from 'express'

const app = express() 


const port = process.env.PORT || 8800
app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`)
})