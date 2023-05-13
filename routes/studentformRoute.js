const router = require("express").Router()
const upload = require("../config/multerConfig");


router.post("/", upload, (req,res) => {
   console.log(req.files);
   res.json({ status: "okay"})
})

module.exports = router;