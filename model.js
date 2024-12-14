const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    number: {
        type: Number,
        required: true
    },
}, { timestamps: true });
const User = mongoose.model('User', userSchema);
module.exports = User;