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
                year: "first",
                academic_fee: first_academic_fee,
                maintenance_fee: first_maintenance_fee,
                hostel_fee: first_hostel_fee,
                mess_fee: first_mess_fee,
                mess_security_fee: first_mess_security_fee
            },
            {
                year: "second",
                academic_fee: second_academic_fee,
                maintenance_fee: second_maintenance_fee,
                hostel_fee: second_hostel_fee,
                mess_fee: second_mess_fee,
                mess_security_fee: second_mess_security_fee
            },
            {
                year: "third",
                academic_fee: third_academic_fee,
                maintenance_fee: third_maintenance_fee,
                hostel_fee: third_hostel_fee,
                mess_fee: third_mess_fee,
                mess_security_fee: third_mess_security_fee
            },
            {
                year: "fourth",
                academic_fee: fourth_academic_fee,
                maintenance_fee: fourth_maintenance_fee,
                hostel_fee: fourth_hostel_fee,
                mess_fee: fourth_mess_fee,
                mess_security_fee: fourth_mess_security_fee
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