var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  userid: String,
  topic: String,
  nowflag: Number,
  conflag: [Number],
  dataset: [String],
  bestMap: String,
  eachMap: {
    dataset1 : [String],
    dataset2 : [String]
  }
});

module.exports = mongoose.model("user",userSchema);
