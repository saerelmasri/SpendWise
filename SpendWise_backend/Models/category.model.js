const mongoose = require('mongoose');

const categoryShema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    icon: {
        type: String,
        require: tru
    },
    type: {
        type: String,
        enum: ['Incomes', 'Expenses']
    }
});

const Category = mongoose.model('Category', categoryShema);
module.exports = Category