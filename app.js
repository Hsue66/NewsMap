var express = require("express"),
    app = express();
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var session = require('express-session');

var News = require('./models/news');
var Users = require('./models/user');

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI);
//mongoose.connect("mongodb://localhost/nc-news", { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.use('/script', express.static(__dirname + '/node_modules/'));

app.use('/cytoData', express.static(__dirname + '/cytoData'));

app.use(session({
    secret: '@#@$MYSIGN#@$#$',
    resave: false,
    saveUninitialized: true
}));

app.set("view engine", "ejs");

var router = require("./router/main")(app,News,Users);

app.listen(PORT, function(){
  console.log("SERVER HAS STARTED!!!");
});
