/***********************************************************************
  TopicMap : Web application for visualizing a news map generated by TopicMaps
  Authors: Sumin Hong (hsue0606@gmail.com), U Kang (ukang@snu.ac.kr)
  Data Mining Lab., Seoul National University

This software is free of charge under research purposes.
For commercial purposes, please contact the authors.

-------------------------------------------------------------------------
File: user.js
 - a Database Schema for participant information in user study.

Version: 1.0
***********************************************************************/

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
