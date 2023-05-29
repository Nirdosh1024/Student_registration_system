const mongoose = require("mongoose")

const newAdmin = mongoose.Schema({
    ID: {
       type: String,
       required: true 
    },

    role: {
        type: String,
        required : true
    },
    hostel: {
        type: String,
    },
    Passwd: {
        type: String,
        required : true
    }
})

const Admin = mongoose.model("Admin", newAdmin);
module.exports = Admin;