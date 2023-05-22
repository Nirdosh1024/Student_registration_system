const mongoose = require("mongoose");

const update = mongoose.Schema({
    update: [{
        heading: String,
        description: String
    }]
})

const updateModel = mongoose.model("updateModel", update)

module.exports = updateModel