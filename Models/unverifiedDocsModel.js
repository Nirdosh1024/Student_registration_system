const mongoose = require("mongoose");


const rawData = mongoose.Schema({
    ID: {
        type: Number,
        required: true,
      },

    fees: 
    {
      academic_fee: Number,
      mess_fee: Number,
      hostel_fee: Number,
      maintenance_fee: Number,
      pending_fee: { academic_fee: Number, mess_fee: Number, hostel_fee : Number , maintenance_fee : Number },

    },
  

  document: [
    {
      doc_name: String,
      filepath: String,
      filename: String,
      verified: Boolean
    },
  ],
})

const unverifiedData = mongoose.model("unverifiedData" , rawData)

module.exports = unverifiedData;