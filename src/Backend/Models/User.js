const mongoose = require("mongoose");

const UserScheme = mongoose.Schema({
  username: {
    type: String,
    minLength: 3,
    maxLength: 15,
    required: true
  },
  password: {
    type: String,
    minLength: 8,
    maxLength: 100,
    required: true
  }
});

module.exports = mongoose.model("User", UserScheme);