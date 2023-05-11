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
  dashboard_created: {
    type: Boolean,
    required: true
  },
  form_submitted: {
    type: Boolean,
    required: false
  }
});

const newStudentModel = mongoose.model("newStudentModel", newStudent);
module.exports = newStudentModel;
