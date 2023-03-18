const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const app = express()
app.use(cors({
    origin:"http://localhost:3000/",
    credentials: true
 }))

app.use(expressLayouts);
app.set("view engine","ejs");
// multer setup to upload files to the server
const storage = multer.diskStorage({
    destination: (req, file , cb) => {
        cb(null, "uploads")
    }, 
    filename: (req, file , cb)=> {
        const { originalname } = file
        cb(null,originalname); 
    }
})
const upload = multer({ storage });



mongoose.connect('mongodb://localhost/myapp',{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=> console.log("Mongo DB Connected....")).catch(err => console.log(err))

 app.post('/',(req,res) =>{
     console.log(req)
     res.status(201).json({
         "statustell":"4000"
     })
 }) 
app.get('/',(req,res) =>{
    res.render('layout')
})
const PORT = process.env.PORT || 5000
app.listen(PORT,() => {
    console.log("Server has started at 5000")
})