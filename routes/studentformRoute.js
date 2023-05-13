const router = require("express").Router()
const multer = require("multer");



router.post("/",(req,res) => {
   console.log(req.body)
   res.json({ status: "okay"})
})

module.exports = router;