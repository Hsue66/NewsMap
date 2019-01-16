var fs = require("fs");

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
      sQuery.sort();
    }
    console.log(sQuery);
    //res.render("search", {sQuery : sQuery});

    News.find({body:{$all:sQuery}},function(err,news){
      if(err){
        console.log("ERROR OCCURED!!!");
        console.log(err);
      } else {
        console.log(news.length);
        var file = "./queryData/"+sQuery+".txt";
        fs.access(file, fs.constants.F_OK, (err) => {
          if(err){
            //console.log("notexist");
            fs.writeFile("./queryData/"+sQuery+".txt",JSON.stringify(news),(err) => {
              if(err){
                console.log("FILE Write ERROR: ");
                console.error(err);
              }else{
                console.log("File has been created");
                console.log(sQuery+".txt has been created. "+news.length+"elements");
              }
            });
          }
        });
        res.render("search",{sQuery : sQuery});
      }
    });
  });

  app.get("/demo",function(req,res){
    res.render("demo",{sQuery : 'vis'});
  });

  app.get('/news', function(req,res){
    News.find({id:"088-0000516274"}, function(err, news){
      if(err) return res.status(500).send({error: 'database failure'});
      res.json(news);
    });
  });

  app.get("/userstudy",function(req,res){
    res.render('userstudy/login');
  });

  app.get("/userstudy/bestMap",function(req,res){
    var sess = req.session;
    res.render("userstudy/bestMap",{topic:sess.topic, dataset:sess.dataset});
  });

  app.post("/sendQ1",function(req,res){
    var sess = req.session;
    if(req.body.Map === 'MapA')
      sess.Qd12 = sess.dataset[0];
    else
      sess.Qd12 = sess.dataset[1];

    res.redirect("/userstudy/eachMap");
  });

  app.get('/userstudy/eachMap',function(req,res){
    var sess = req.session;
    res.render("userstudy/eachMap",{now:sess.nowflag});
  });

  app.get("/userstudy/cohMap/:idx",function(req,res){
    console.log(req.params.idx)
    res.send(req.params.idx)
    //var sess = req.session;
    //res.render("userstudy/cohMap",{idx:req.params.idx,dataset:sess.dataset[req.params.idx],redflag:0});
  });


  var userjsonDir = __dirname + "/../userData/user.json";

  app.post("/login",function(req,res){
    var username = req.body.id;
    var sess;
    sess = req.session;

    fs.readFile(userjsonDir, "utf8", function(err, data){
        var users = JSON.parse(data);
        //var username = req.params.username;
        //var password = req.params.password;
        var result = {};
        if(!users[username]){
            // USERNAME NOT FOUND
            result["success"] = 0;
            result["error"] = "not found";
            res.json(result);
            return;
        }
        result["success"] = 1;
        sess.username = username;
        sess.name = users[username]["name"];
        sess.dataset = users[username]["dataset"];
        sess.topic = users[username]["topic"];
        sess.Qd12 = "";
        sess.Qd1 = users[username]["Qd1"];
        sess.Qd2 = users[username]["Qd2"];
        sess.nowflag = 0;
        //res.json(result);
        res.redirect("/userstudy/bestMap")
    });
  });

};
