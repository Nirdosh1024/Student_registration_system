const router = require("express").Router();

const newStudentModel = require("../Models/studentModel");

router.post("/", (req, res) => {
    const {
        JEERoll,
        name,
        father_name,
        mother_name,
        dob,
        gender,
        year,
        branch,
        Phone_number,
        email,
        aadhar_number
    } = req.body;


    console.log(JEERoll + " " + father_name + " " + mother_name + " " + gender + " " + branch + " " + Phone_number + " " + aadhar_number);


    if(req.body) {
        newStudentModel.findOne({ ID : JEERoll }).then((user) => {
            user.dashboard_created = true;
            user.FatherName = father_name;
            user.MotherName = mother_name;
            user.Gender = gender;
            user.DOB = dob;
            user.Year = year;
            user.Branch = branch;
            user.PhoneNumber = Phone_number;
            user.AadharNumber = aadhar_number;
            user.save().then(() => {
                console.log("user saved");
            }).catch((err) => {
                console.log(`couldn't save due to error ${err}`);
            });
            console.log(user);
        }).catch((err) => {
            console.error(err);
        });
    }



    res.json({status: "Okay"});
});


module.exports = router;