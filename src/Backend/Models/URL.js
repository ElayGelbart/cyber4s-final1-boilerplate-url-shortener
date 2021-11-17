const mongoose = require("mongoose");

const URLScheme = mongoose.Schema({
  username: {
    type: String,
    minLength: 3,
    maxLength: 15,
    required: true
  },
  creationDate: Date,
  redirectCount: Number,
  originalUrl: String,
  newUrl: String,
  ipEntrys: {
    type: Array,
  }
});

module.exports = mongoose.model("URL", URLScheme);