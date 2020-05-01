const mongoose = require("mongoose");
require("dotenv").config();

const messageSchema = mongoose.Schema({
    reciever: {
        type: String,
        ref: "User",
    },
    sender: {
        type: String,
        ref: "User",
    },
    name: {
        type: String
    },
    lastname: {
        type: String
    },
    text: {
        type: String
    },
    timeStamp: {
        type: String
    },
    dialogId: {
        type: String,
        ref: 'Dialog'
    }
});

const Message = mongoose.model("Message", messageSchema);

module.exports = { Message };
