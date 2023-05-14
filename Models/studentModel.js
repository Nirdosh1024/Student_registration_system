/** @format */

const mongoose = require("mongoose");


const newStudent = mongoose.Schema({
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
    lowerCase: true
  },
  role: {
    type: String,
    required: true
  },
  FatherName: {
    type: String,
    required: true
  },
  MotherName: {
    type: String,
    required: true
  },
  Gender: {
    type: String,
    required: true
  },
  PhoneNumber: {
    type: Number,
    required: true
  },
  Email : {
    type :String, 
    required: true
  },  
  
  AadharNumber: {
    type: Number,
    required: true
  },
  DOB: {
    type: String,
    required: true
  },
  Year: {
    type: String,
    required: true
  },
  dashboard_created: {
    type: Boolean,
    required: true
  },
  form_submitted: {
    type: Boolean,
    required: false
  },
 
  semester:{
    type:String,
    required:true
  },
  father_name:{
    type: String,
    required: true
  },
  mother_name: {
    type: String,
    required: true
  },
  parent_phn: {
    type: Number,
    required: true
  },
  parent_email: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  income: {
    type: String,
    required: true
  },
  gaurdian_name: {
    type: String,
  },
  gaurdian_phn:{
    type: Number
  },
  highschool_percent:{
    type: Number,
    required: true
  },
  inter_percent:{
    type: Number,
    required: true
  },
  JEE_percentile:{
    type: Number,
    required: true
  },
  hosteller:{
    type: String,
    required: true
  },
  room_no:{
    type: String,
  },
  
  document:[{
    doc_name: String,
    filepath : String,
    filename : String
}]

});

const newStudentModel = mongoose.model("newStudentModel", newStudent);
module.exports = newStudentModel;
