var express = require("express");
var app = express();

var router = require("./router/main")(app);

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.use('/script', express.static(__dirname + '/node_modules/'));

app.use('/cytoData', express.static(__dirname + '/cytoData'));

app.set("view engine", "ejs");

app.listen(PORT, function(){
  console.log("SERVER HAS STARTED!!!");
});
