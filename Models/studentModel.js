/** @format */

const mongoose = require("mongoose");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const newStudent = mongoose.Schema({
  ID: {
    type: Number,
    required: true,
  },

  Name: {
    type: String,
    required: true,
  },

  Email: {
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
  },
});

const newStudentModel = mongoose.model("newStudentModel", newStudent);
module.exports = newStudentModel;
