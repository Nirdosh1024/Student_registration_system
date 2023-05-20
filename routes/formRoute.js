const router = require("express").Router();

const newStudentModel = require("../Models/studentModel");

router.post("/", async (req, res) => {
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


    // console.log(JEERoll + " " + father_name + " " + mother_name + " " + gender + " " + branch + " " + Phone_number + " " + aadhar_number);


    if(req.body) {
        //console.log(req.body)
        const user  = await newStudentModel.findOne({ ID: JEERoll, Branch: branch });
    
        if(!user) {
            res.json({status: "Not Okay"});
        } else {
            user.dashboard_created = true;
            user.FatherName = father_name;
            user.MotherName = mother_name;
            user.gender = gender;
            user.DOB = dob;
            user.Year = year;
            user.Branch = branch;
            user.phoneNumber = Phone_number;
            user.AadharNumber = aadhar_number;
            user.Email = email;

            user.save().then(() => {
                console.log("User Saved");
                res.json({status: "Okay"});
            }).catch((err) => {
                console.log(err);
            })
        }
    }
});


module.exports = router;