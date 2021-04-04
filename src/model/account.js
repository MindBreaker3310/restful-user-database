const mongoose = require('mongoose');

const Account = mongoose.model('Account', {
    deposit: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
})


module.exports = Account


