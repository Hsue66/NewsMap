/***********************************************************************
  TopicMap : Web application for visualizing a news map generated by TopicMaps
  Authors: Sumin Hong (hsue0606@gmail.com), U Kang (ukang@snu.ac.kr)
  Data Mining Lab., Seoul National University

This software is free of charge under research purposes.
For commercial purposes, please contact the authors.

-------------------------------------------------------------------------
File: controller.js
 - A control module associated with the main API at index.js

Version: 1.0
***********************************************************************/

// Load the required modules that the controller needs.
var convert = require("./convert.js");

/**
 * Show main page
 *
 * @return 'main' page.
 */
exports.main = function(req,res){
  res.render("main");
};

/**
 * Show search page
 * @param req.query.sQuery
 *          a user-selected search query
 * @return 'search' page.
 */
exports.search = function(req,res){
  var sQuery = req.query.sQuery;
  res.render("search",{sQuery : sQuery});
};

/**
 * Show upload page
 *
 * @return 'upload' page.
 */
exports.upload = function(req,res){
  res.render("upload");
};

/**
 * Convert the uploaded files to a map and show redirect link
 *
 * @return redirect link.
 */
exports.uploadAndConvert = function(req,res){
  convert.convert();
  var output = `<a href="/demo">생성된 Map보기</a>`
  res.send(output);
};

/**
 * Show demo page
 *
 * @return 'demo' page.
 */
exports.demo = function(req,res){
  res.render("demo");
};

/**
 * Show 404 error page
 *
 * @return 'wrong' page.
 */
exports.wrong = function(req,res){
  res.render("wrong");
};
