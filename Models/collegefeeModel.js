const mongoose = require("mongoose");

const collegefee = mongoose.Schema({
  year: {
    type: String,
    academic_fee: {
      type: Number,
      required: true,
    },

    hostel_fee: { type: Number, required: true },

    mess_fee: {
      type: Number,
      required: true,
    },
    mess_security_fee: {
      type: Number,
    },

    maintenance_fee: {
      type: Number,
      required: true,
    },
  },
});

const collegefeeModel = mongoose.model("collegefeeModel", collegefee);

module.exports = collegefeeModel;
