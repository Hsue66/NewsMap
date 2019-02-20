/***********************************************************************
  TopicMap : a Web application for people who want to generate and visualize news map.
  Authors: Sumin Hong(hsue0606@gmail.com), U Kang (ukang@snu.ac.kr)
  Data Mining Lab., Seoul National University

This software is free of charge under research purposes.
For commercial purposes, please contact the authors.

-------------------------------------------------------------------------
File: app.js
 - A main server file of TopicMap.

Version: 1.0
***********************************************************************/

var express = require("express"),
    app = express();
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var session = require('express-session');

var Users = require('./models/user');
var Datasets = require('./models/dataset');

const PORT = process.env.PORT || 3000;

// connect to mongoDB (heroku / local)
mongoose.connect(process.env.MONGODB_URI);
//mongoose.connect("mongodb://localhost/nc-news", { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));

// include static file
app.use(express.static("public"));
app.use('/script', express.static(__dirname + '/node_modules/'));
app.use('/cytoData', express.static(__dirname + '/cytoData'));

// use login session
app.use(session({
    secret: '@#@$MYSIGN#@$#$',
    resave: false,
    saveUninitialized: true
}));

// set view engine as ejs
app.set("view engine", "ejs");

// import router
var router = require("./router/main")(app,Users,Datasets);

// start server and listen for connentions
app.listen(PORT, function(){
  console.log("TopicMap SERVER HAS STARTED!!!");
});
