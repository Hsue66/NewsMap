/***********************************************************************
  TopicMap : Web application for visualizing a news map generated by TopicMaps
  Authors: Sumin Hong (hsue0606@gmail.com), U Kang (ukang@snu.ac.kr)
  Data Mining Lab., Seoul National University

-------------------------------------------------------------------------
File: app.js
 - A main server file of TopicMap.

Version: 1.0
***********************************************************************/

// Load the required modules that server needs
var express = require("express"),
    app = express();
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var session = require('express-session');

// Set port
const PORT = process.env.PORT || 3000;

// Connect to mongoDB (heroku / local)
//mongoose.connect(process.env.MONGODB_URI);
mongoose.connect("mongodb://localhost/nc-news", { useNewUrlParser: true });

// Define the location of the template files
app.use(express.static("public"));
app.use('/script', express.static(__dirname + '/node_modules/'));
app.use('/cytoData', express.static(__dirname + '/cytoData'));

// Create a login session
app.use(session({
    secret: '@#@$MYSIGN#@$#$',
    resave: false,
    saveUninitialized: true
}));

// Set bodyParser
app.use(bodyParser.urlencoded({extended: true}));

// Set view engine as ejs
app.set("view engine", "ejs");

// Import router
app.use('/', require('./router/index'));


// Start server and listen for connentions
app.listen(PORT, function(){
  console.log("TopicMap SERVER HAS STARTED!!!");
});
