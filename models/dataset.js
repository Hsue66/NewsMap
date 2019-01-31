var mongoose = require('mongoose');

var datasetSchema = new mongoose.Schema({
  userId: String,
  datasetId: String,
  incohA: Number,
  recurA: Number,
  recurT: Number,
  connA : Number
});

module.exports = mongoose.model("dataset",datasetSchema);
