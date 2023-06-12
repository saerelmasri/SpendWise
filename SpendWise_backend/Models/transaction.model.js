const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    goalID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goal'
    },
    loanID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Loans'
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        require: true
    },
    amount: {
        type: Number,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Transaction = mongoose.model('Transactions', transactionSchema);
module.exports = Transaction