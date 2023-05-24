const router = require("express").Router();

const Adminfee = require("../Models/collegefeeModel")

router.post("/" , async (req,res) => {
    const { 
        academic_fee,
        maintenance_fee,
        hostel_fee,
        mess_fee,
       mess_security_fee,
       year
     
    } = req.body



    if(req.body){
        const feeDetail = await Adminfee.findOne({year : year});
        if(feeDetail)
        {await Adminfee.findOneAndUpdate({year :year },{
            academic_fee: parseInt(academic_fee),
            maintenance_fee:parseInt(maintenance_fee),
            hostel_fee: parseInt(hostel_fee),
            mess_fee: parseInt(mess_fee),
            mess_security_fee: parseInt(mess_security_fee)
        } ).then((result) => {
            console.log("feedetail is updated")
            res.send({status : "okay"})
        }).catch((err) => {
            console.log(err)
        });}
            
              
      else{ 
           await Adminfee.create(
          {year :year,
                academic_fee: parseInt(academic_fee),
                maintenance_fee:parseInt(maintenance_fee),
                hostel_fee: parseInt(hostel_fee),
                mess_fee: parseInt(mess_fee),
                mess_security_fee: parseInt(mess_security_fee)
            }).then((result) => {
               console.log("feedetail is saved" , year) 
               res.send({status : "okay"})
            }).catch((err) => {
                console.log(err)
            });

            
        
        }}

//console.log(req.body)
})


module.exports = router;