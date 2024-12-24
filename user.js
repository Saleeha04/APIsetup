const mongoose = require('mongoose');

const userAuthySchema = new mongoose.Schema ({
    username: {
        type: String,
        required: [true, 'Username cannot be blank']
    },
    password: {
        type: String,
        required: [true, 'Password cannot be blank']
    }
})

module.exports = mongoose.model('UserAuth', userAuthySchema);
