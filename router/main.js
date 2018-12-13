module.exports = function(app){

  app.get("/",function(req,res){
    res.render("main");
  });

  app.get("/search",function(req,res){
    var sQuery = req.query.sQuery;
    if(sQuery !== undefined){
      sQuery = (sQuery.replace(/,/g,' ')).replace(/ +/g,' ');
      sQuery = sQuery.trim();
      sQuery = sQuery.split(' ');
    }
    console.log(sQuery);
    res.render("search", {sQuery : sQuery});
  });

  app.get("/demo",function(req,res){
    res.render("demo");
  });

};
