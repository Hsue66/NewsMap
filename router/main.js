module.exports = function(app,News){

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

  app.get('/news', function(req,res){
    News.find({id:"088-0000516274"}, function(err, news){
      if(err) return res.status(500).send({error: 'database failure'});
      res.json(news);
    });
  });
};
