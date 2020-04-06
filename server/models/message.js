const mongoose = require('mongoose');
require('dotenv').config();

const messageSchema = mongoose.Schema({

    text: {
        type: String,
        maxlength: 200,
        required: true
    },
    userId: {
        type: Number,
        maxlength: 100,
        required: true
    },
    timeStamp: {
        type: String,
        required: true
    }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = { Message }