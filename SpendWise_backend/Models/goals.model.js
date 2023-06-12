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
    }
});

const Goal = mongoose.model('Goal', goalSchema);
module.exports = Goal