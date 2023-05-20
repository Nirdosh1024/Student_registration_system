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
    required: true,
  },
  MotherName: {
    type: String,
    required: true,
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
    required: true,
  },
  DOB: {
    type: String,
    required: true,
  },
  Year: {
    type: String,
    //required: true,
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
  },
  gaurdian_phn: {
    type: Number,
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
  room_no: {
    type: String,
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
      fee_paid: Boolean,
    },
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
   //required : true
  },
  accept_terms: {
    type: Boolean,
    //required: true,
    default: false,
  },
});

const newStudentModel = mongoose.model("newStudentModel", newStudent);
module.exports = newStudentModel;
