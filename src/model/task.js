const mongoose = require('mongoose');

const Task = mongoose.model({
    description: {
        type: String,
        requrie: true
    },
    completed: {
        type: Boolean,
        requrie: true
    }
})

module.exports = Task


