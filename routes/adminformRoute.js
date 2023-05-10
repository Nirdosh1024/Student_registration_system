const router = require("express").Router();

const Adminfee = require("../Models/collegefeeModel")

router.post("/" , (req,res) => {
    const { 
       academic_fee,
       maintenance_fee,
       hostel_fee,
       mess_fee,
       mess_security_fee       
    } = req.body

console.log(academic_fee + " " + maintenance_fee + " " + hostel_fee + " " + mess_fee + " " + mess_security_fee)

    if(req.body){
        const newAdminfee = new Adminfee({
        })
    }
console.log(req.body)
console.log(req.body.mess_fee)
})


module.exports = router;