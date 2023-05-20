const mongoose = require("mongoose");

const collegefee = mongoose.Schema({
      year: {
        type: String,
        required: true
      },
      academic_fee: {
        type: Number,
        required: true
      },
      maintenance_fee: {
        type: Number,
        required: true
      },
      hostel_fee: {
        type: Number,
        required: true
      },
      mess_fee: {
        type: Number,
        required: true
      },
      mess_security_fee: {
        type: Number,
        default : 0,
        //required: true
      }
});

const collegefeeModel = mongoose.model("collegefeeModel", collegefee);

module.exports = collegefeeModel;
