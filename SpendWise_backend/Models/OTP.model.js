const mongoose = require('mongoose');

const OTPSchema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        require: true
    },
    OTP: {
        type: String,
        require: true
    }
});

const OTP = mongoose.model('OTP', OTPSchema);
module.exports = OTP;