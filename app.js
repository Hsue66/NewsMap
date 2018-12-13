var express = require("express"),
    app = express();
var mongoose = require('mongoose');

var Books = require('./models/books');
var router = require("./router/main")(app,Books);

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI);

app.use(express.static("public"));

app.use('/script', express.static(__dirname + '/node_modules/'));

app.use('/cytoData', express.static(__dirname + '/cytoData'));

app.set("view engine", "ejs");

app.listen(PORT, function(){
  console.log("SERVER HAS STARTED!!!");
});
