const mongoose = require('mongoose');

const logSchema = mongoose.Schema({
    categoryID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        require: true
    },
    walletID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallets',
        require: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        require: true
    },
    logAmount: {
        type: Number,
        require: true
    },
    logDescription: {
        type: String,
        require: true,
        maxLength: 32
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Log = mongoose.model('Logs', logSchema);
module.exports = Log