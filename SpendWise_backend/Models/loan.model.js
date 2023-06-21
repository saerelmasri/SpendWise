const mongoose = require('mongoose');

const loanSchema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        require: true
    },
    loanName: {
        type: String,
        require: true,
        maxLength: 32
    },
    loanAmount: {
        type: Number,
        require: true
    },
    loanInterestRate: {
        type: String,
        require: true
    },
    loanTermInYears: {
        type: Number,
        require: true
    },
    loanMonthyPay: {
        type: Number,
        require: true
    }
})

const Loan = mongoose.model('Loans', loanSchema);
module.exports = Loan