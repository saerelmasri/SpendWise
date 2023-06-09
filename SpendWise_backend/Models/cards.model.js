const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        require: true
    },
    name: {
        type: String,
        require: true,
        maxLength: 30
    },
    amount: {
        type: Number,
        require: true
    },
    description: {
        type: String,
        require: true,
        maxLength: 30
    }
});

const Cards = mongoose.model('Cards', cardSchema);

module.exports = Cards