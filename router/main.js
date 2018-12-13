module.exports = function(app,Books){

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

  // GET ALL BOOKS
  app.get('/books', function(req,res){
    Books.find(function(err, books){
      if(err) return res.status(500).send({error: 'database failure'});
      res.json(books);
    });
  });

};
