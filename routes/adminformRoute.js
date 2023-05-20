const router = require("express").Router();

const Adminfee = require("../Models/collegefeeModel")

router.post("/" , (req,res) => {
    const { 
        first_academic_fee,
        first_maintenance_fee,
        first_hostel_fee,
        first_mess_fee,
        first_mess_security_fee,
        second_academic_fee,
        second_maintenance_fee,
        second_hostel_fee,
        second_mess_fee,
        second_mess_security_fee,
        third_academic_fee,
        third_maintenance_fee,
        third_hostel_fee,
        third_mess_fee,
        third_mess_security_fee,
        fourth_academic_fee,
        fourth_maintenance_fee,
        fourth_hostel_fee,
        fourth_mess_fee,
        fourth_mess_security_fee,
    } = req.body

    console.log(first_academic_fee + " " + second_mess_fee + " " + third_mess_security_fee + " " + fourth_hostel_fee);

    if(req.body){
        Adminfee.insertMany([
            {
                year: "1st",
                academic_fee: parseInt(first_academic_fee),
                maintenance_fee:parseInt(first_maintenance_fee),
                hostel_fee: parseInt(first_hostel_fee),
                mess_fee: parseInt(first_mess_fee),
                mess_security_fee: parseInt(first_mess_security_fee)
            },
            {
                year: "2nd",
                academic_fee: parseInt(second_academic_fee),
                maintenance_fee: parseInt(second_maintenance_fee),
                hostel_fee: parseInt(second_hostel_fee),
                mess_fee: parseInt(second_mess_fee),
         
            },
            {
                year: "3rd",
                academic_fee: parseInt(third_academic_fee),
                maintenance_fee: parseInt(third_maintenance_fee),
                hostel_fee: parseInt(third_hostel_fee),
                mess_fee: parseInt(third_mess_fee),

            },
            {
                year: "4th",
                academic_fee: parseInt(fourth_academic_fee),
                maintenance_fee: parseInt(fourth_maintenance_fee),
                hostel_fee: parseInt(fourth_hostel_fee),
                mess_fee: parseInt(fourth_mess_fee),
            }
        ]).then(() => {
            console.log("Data Inserted");
        }).catch((err) => {
            console.error(err);
        })
    }
console.log(req.body)
})


module.exports = router;