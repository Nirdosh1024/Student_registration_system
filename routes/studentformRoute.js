const router = require("express").Router()
const upload = require("../config/multerConfig");


const newStudentModel = require("../Models/studentModel")
const upload = require("../config/multerConfig")
const fs = require('fs')



router.post("/",upload,(req,res) => {

const obj= {
      filename : req.body.photo_file,
      image: {
         data: fs.readFileSync(req.files["photo_file"][0].path),
            contentType: 'image/jpg'
      }
   }
   newStudentModel.create(obj).then((err, item) => {
      if(err){
         console.log(err)
      }
      else{
         res.redirect('/')
      }
   })
   res.json({ status: "okay"})
})

module.exports = router;