/** @format */

const mongoose = require("mongoose");

const newStudent= mongoose.Schema({
  ID: {
    type: Number,
    required: true,
  },
  
  Name: {
    type: String,
    required: true,
  },
  batch:{
    type: String
  },
  Branch: {
    type: String,
    required: true,
  },
  Rank: {
    type: Number,
    required: true,
  },
  passwd: {
    type: String,
    required: true,
    lowerCase: true,
  },
  role: {
    type: String,
    required: true,
  },
  FatherName: {
    type: String,
    //required: true,
    default : ""
  },
  MotherName: {
    type: String,
    //required: true,
    default : ""
  },
  gender: {
    type: String,
   // required: true,
  },
  phoneNumber: {
    type: Number,
    //required: true,
  },
  Email: {
    type: String,
  },

  AadharNumber: {
    type: Number,
    //required: true,
    default : 0
  },
  DOB: {
    type: String,
    //required: true,
    default : ""
  },
  Year: {
    type: String,
    //required: true,
    default : ""
  },

  semester: {
    type: String,
   // required: true,
    default: 1,
  },
  parent_phn: {
    type: Number,
    //required: true,
    default: 0,
  },
  parent_alternate_no: {
    type: Number,
    default: 0
  },
  parent_email: {
    type: String,
    //required: true,
    default: "",
  },
  category: {
    type: String,
    //required: true,
    default: "",
  },
  income: {
    type: String,
    //required: true,
    default: "",
  },
  address: {
    type: String,
    //required: true,
    default: "",
  },
  gaurdian_name: {
    type: String,
    default: ""
  },
  gaurdian_phn: {
    type: Number,
    default: ""
  },
  gaurdian_address: {
    type: String,
    //required: true,
    default: "",
  },
  highschool: 
    {
      passing_year: Number,
      board: String,
      institute: String,
      percent: Number,
    },
  
  intermediate: 
    {
      passing_year: Number,
      board: String,
      institute: String,
      percent: Number,
    },
  
  JEE_rank: {
    type: Number,
    default: 0,
    //required: true,
  },
  JEE_percentile: {
    type: Number,
    default: 0,
    //required: true,
  },
  hosteller: {
    type: Boolean,
    default: true,
    //required: true,
  },
  hostel : {
    type: String,
    default : ""
  },
  room_no: {
    type: String,
    default: ""
  },
  fee_type:{
    type: Boolean,
    //required: true
  },

  fees: 
    {
      academic_fee: Number,
      mess_fee: Number,
      hostel_fee: Number,
      maintenance_fee: Number,
      pending_fee: { academic_fee: Number, mess_fee: Number, hostel_fee : Number , maintenance_fee : Number },

    },
    fee_paid:{ type : Boolean},

  document: [
    {
      doc_name: String,
      filepath: String,
      filename: String,
    },
  ],
  dashboard_created: {
    type: Boolean,
    required: true,
  },
  form_submitted: {
    type: Boolean,
    required: true,
  },
  data_validated_by_admin:{
   type: Number,
   required : true,
   default: 0
  },
  verified_by_accounts: {
    type: Boolean,
    required: true,
    default: false
  },
  verified_by_dean_acad: {
    type: Boolean,
    required: true,
    default: false
  },
  verified_by_warden: {
    type: Boolean,
    required: true,
    default: false
  },
  rejected_by_accounts: {
    type: Boolean,
    required: true,
    default: false
  },
  rejected_by_warden: {
    type: Boolean,
    required: true,
    default: false
  },
  rejected_by_dean_acad: {
    type: Boolean,
    required: true,
    default: false
  },
  accept_terms: {
    type: Boolean,
    //required: true,
    default: false,
  },
});

const newStudentModel = mongoose.model("newStudentModel", newStudent);
module.exports = newStudentModel;
