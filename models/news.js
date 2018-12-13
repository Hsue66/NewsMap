var mongoose = require('mongoose');

var newsSchema = new mongoose.Schema({
  id: String,
  title: String,
  contents: String,
  body: [String],
  date: String
});

module.exports = mongoose.model("news",newsSchema);
