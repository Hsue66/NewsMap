// controller.js
var fs = require("fs");
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
 *
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
 * @return 'upload' page.
 */
exports.uploadAndConvert = function(req,res){
  convert.convert(fs);
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
 * Show 404 page
 *
 * @return 'wrong' page.
 */
exports.wrong = function(req,res){
  res.render("wrong");
};
