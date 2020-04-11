const mongoose = require("mongoose");
require("dotenv").config();

const dialogSchema = mongoose.Schema({
  messages: {
    type: Array,
    required: true,
  },
});

const Dialog = mongoose.model("Dialog", dialogSchema);

module.exports = { Dialog };
