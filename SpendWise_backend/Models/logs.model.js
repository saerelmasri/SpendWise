const mongoose = require('mongoose');

const logSchema = mongoose.Schema({
    categoryID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        require: true
    },
    cardID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cards',
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