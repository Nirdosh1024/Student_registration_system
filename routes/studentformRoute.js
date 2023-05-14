const router = require("express").Router()


const newStudentModel = require("../Models/studentModel")
const upload = require("../config/multerConfig")
const fs = require('fs')


router.post("/",upload, async (req,res) => {
    const{
      enrollment_number,
      gender,
      course,
      semester,
      parentphone_number,
      parent_email,
      alter_phnno,
      category,
      income,
      gaurdian_name,
      gaurdian_phnno,
      p_street_1,
      p_street_2,
      p_city,
      p_state,
      p_pincode,
      g_street_1,
      g_street_2,
      g_city,
      g_state,
  g_pincode,
  highschool_institute,
  highschool_board,
  highschool_maxmarks,
  highschool_marks,
  highschool_year,
  intermediate_institute,
  intermediate_board,
  inter_maxmarks,
  inter_marks,
  inter_year,
  rank,
  percentile,
  hosteller,
  floor,
  room_no,
  fee_type,
  academicfee_amount,
  messfee_amount,
  messsecurityfee_amount,
  hostelfee_amount,
  maintenancefee_amount,
  accept_terms
    } = req.body;
  
    const highschoolPercent = percentCalculate(highschool_marks,highschool_maxmarks);
    const interPercent = percentCalculate(inter_marks,inter_maxmarks);

    const highschool = {passing_year: highschool_year , board: highschool_board, institute: highschool_institute , percent : highschoolPercent};

    const intermediate = {passing_year: inter_year , board: intermediate_board, institute: intermediate_institute , percent : interPercent}

    const feeDetail = { academic_fee :parseInt(academicfee_amount), mess_fee : messfee_amount, messsecurity_fee : messsecurityfee_amount, hostel_fee : hostelfee_amount,
      maintenance_fee : maintenancefee_amount,
   pending_fee: {academic_fee: 0 , mess_fee: 0}, fee_paid: false}

   //file property fetch

   const object = req.files;
   let fileArray = [];
   //console.log(Object.values(object))
   Object.values(object).forEach((file,index) => {
      fileArray.push({
         doc_name: file[0].fieldname,
         filepath: file[0].path,
         filename: file[0].originalname
      })
   })
  console.log(fileArray)

   
    
   if(req.body){
         
    
      const user  = await newStudentModel.findOne({ ID: enrollment_number });
      
      if(!user) {
         res.json({status: "Not Okay"});}
      else{
          user.gender = gender;
          user.semester = semester;
          user.parent_phn = parentphone_number;
          user.parent_alternate_no = alter_phnno;
          user.parent_email = parent_email;
          user.category = category;
          user.income = income;
          user.address = p_street_1 + " " + p_street_2 + " " + p_city + " " + p_state + " " + p_pincode;
          user.gaurdian_name = gaurdian_name;
          user.gaurdian_phn = gaurdian_phnno;
          user.gaurdian_address = g_street_1 + g_street_2 +  g_city + g_state + g_pincode;
          user.highschool = highschool;
          user.intermediate = intermediate;
          user.JEE_rank = rank;
          user.JEE_percentile = percentile;
          user.hosteller = Boolean(hosteller);
          user.room_no= floor + '-' + room_no;
          user.fee_type = Boolean(fee_type);
          user.fees = feeDetail;
          user.document = fileArray;
          user.data_validated_by_admin = 0;
          user.accept_terms = true;


       user.save().then(() => {
         console.log("user data is saved")
         res.json({status : "okay"})
       }).catch((err) => {
         console.log(err)
         res.json({status : "not okay"})
       })
      }


   }
   
   


})

//function to calculate percentage
const percentCalculate = (marks,maxmarks) => {
   const intMarks = parseInt(marks);
   const intmaxMarks = parseInt(maxmarks);  
   const percent =  parseFloat((intMarks/intmaxMarks)*100).toFixed(2);
   return percent;
}

module.exports = router;