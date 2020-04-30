const mongoose = require("mongoose");
require("dotenv").config();

const dialogSchema = mongoose.Schema({
  participants: {
    type: Array,
    ref: 'User'
  },
  messages: {
    type: Array,
    ref: 'Message'
  },
});

const Dialog = mongoose.model("Dialog", dialogSchema);

module.exports = { Dialog };
