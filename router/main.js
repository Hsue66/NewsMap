module.exports = function(app){
  app.get("/",function(req,res){
    res.render("demo");
  });

  app.get("/layout", function(req,res){
    res.render("layout");
  });
};
