var express = require("express"),
    app = express();
var mongoose = require('mongoose');

var News = require('./models/news');
var router = require("./router/main")(app,News);

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI);
//mongoose.connect("mongodb://localhost/nc-news", { useNewUrlParser: true });

app.use(express.static("public"));

app.use('/script', express.static(__dirname + '/node_modules/'));

app.use('/cytoData', express.static(__dirname + '/cytoData'));

app.set("view engine", "ejs");

app.listen(PORT, function(){
  console.log("SERVER HAS STARTED!!!");
});
