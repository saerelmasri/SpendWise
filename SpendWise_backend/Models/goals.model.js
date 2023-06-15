const mongoose = require('mongoose');

const goalSchema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        require: true
    },
    goalName: {
        type: String,
        require: true
    },
    goalAmount: {
        type: Number,
        require: true
    },
    goalCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        require: true
    },
    goalDeadline: {
        type: Number,
        require: true
    },
    goalCreatedAt: {
        type: Date,
        default: Date.now
    },
    paymentPerMonth: {
        type: Number,
    },
    goalProgress: {
        type: Number,
        default: 0
    }
});

const Goal = mongoose.model('Goal', goalSchema);
module.exports = Goal