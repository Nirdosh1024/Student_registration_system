const router = require("express").Router()


const newStudentModel = require("../Models/studentModel")
const upload = require("../config/multerConfig")
const Adminfee = require("../Models/collegefeeModel")
const unverifedData = require("../Models/unverifiedDocsModel")

router.post("/", upload, async (req, res) => {
   const {
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


   const id = req.session.passport.user._id


   const user = await newStudentModel.findById(id)
   const year = user.Year;
   console.log(year)
   const adminfee = await Adminfee.findOne({ year: year });


   const Academicfee = adminfee.academic_fee;
   const Messfee = adminfee.mess_fee;
   const Hostelfee = adminfee.hostel_fee;
   const Maintenancefee = adminfee.maintenance_fee;
   const Messsecurityfee = adminfee.mess_security_fee;

   const totalmessFee = Messfee + Messsecurityfee;
   const pendingAcademic = Academicfee - parseInt(academicfee_amount)
   const pendingHostel = Hostelfee - parseInt(hostelfee_amount);
   const pendingMess = totalmessFee - (parseInt(messfee_amount) + parseInt(messsecurityfee_amount));
   const pendigMaintenance = Maintenancefee - parseInt(maintenancefee_amount);

   const highschoolPercent = percentCalculate(highschool_marks, highschool_maxmarks);
   const interPercent = percentCalculate(inter_marks, inter_maxmarks);

   const highschool = { passing_year: highschool_year, board: highschool_board, institute: highschool_institute, percent: highschoolPercent };

   const intermediate = { passing_year: inter_year, board: intermediate_board, institute: intermediate_institute, percent: interPercent }

   const feeDetail = {
      academic_fee: parseInt(academicfee_amount), mess_fee: parseInt(messfee_amount) + parseInt(messsecurityfee_amount), hostel_fee: parseInt(hostelfee_amount),
      maintenance_fee: parseInt(maintenancefee_amount),
      pending_fee: { academic_fee: pendingAcademic, mess_fee: pendingMess, hostel_fee: pendingHostel, maintenance_fee: pendigMaintenance }
   }

   //file property fetch

   const object = req.files;
   let fileArray = [];
   //console.log(Object.values(object))
   Object.values(object).forEach((file, index) => {
      fileArray.push({
         doc_name: file[0].fieldname,
         filepath: file[0].path,
         filename: file[0].originalname,
         verified : false
      })
   })
   console.log(fileArray)



   if (req.body) {


      const user = await newStudentModel.findOne({ ID: enrollment_number });
      
      if (!user) {
         res.json({ status: "Not Okay" });
      }
      else {
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
         user.gaurdian_address = g_street_1 + g_street_2 + g_city + g_state + g_pincode;
         user.highschool = highschool;
         user.intermediate = intermediate;
         user.JEE_rank = rank;
         user.JEE_percentile = percentile;
         user.hosteller = Boolean(hosteller);
         user.room_no = floor + '-' + room_no;
         user.fee_type = Boolean(fee_type);
         
    
         user.data_validated_by_admin = 0;
         user.accept_terms = true;
      
         if(pendingMess === 0 || pendigMaintenance === 0 || pendingHostel === 0 || pendingAcademic === 0){
            user.fee_paid = true;
         }
      
         user.save().then(() => {
            console.log("user data is saved")
            res.json({ status: "okay" })
         }).catch((err) => {
            console.log(err)
            res.json({ status: "not okay" })
         })
      }
      const unverifiedUser = await unverifedData.create({
         ID : enrollment_number,
         fees : feeDetail,
         document : fileArray
      }).then(() => {
         console.log("user data is saved in unverified database")
      }).catch((err) => {
         console.log(err)

      })
     
   }
   



})

//function to calculate percentage
const percentCalculate = (marks, maxmarks) => {
   const intMarks = parseInt(marks);
   const intmaxMarks = parseInt(maxmarks);
   const percent = parseFloat((intMarks / intmaxMarks) * 100).toFixed(2);
   return percent;
}


module.exports = router;