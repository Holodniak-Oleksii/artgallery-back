const express = require("express")
require('dotenv').config()
const mongoose = require("mongoose")
const app = express()
const upload = require('./routes/upload')
const PORT = process.env.PORT || 5000
const URI = process.env.MONGO_URI
const cors = require("cors");
const path = require("path");

app.use(cors());
app.use(express.json({extended: true}))
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use('/api/upload', upload)

async function start(){
  try{
    await mongoose.connect(URI,{})
    app.listen(PORT, ()=>{
      console.log(`Server started on port ${PORT}...`);
    })
  }catch(e){
    console.log(e)
    process.exit(1)
  }
}

start()
