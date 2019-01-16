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

  app.get("/userstudy/cohMap",function(req,res){
    var sess = req.session;
    res.render("userstudy/cohMap",{idx:sess.nowflag,dataset:sess.dataset[sess.nowflag],redflag:0});
  });

  app.post("/sendQ2",function(req,res){
    var sess = req.session;

    if(sess.nowflag)
      sess.Qd2[parseInt(req.body.redflag)] = req.body.articles;
    else
      sess.Qd1[parseInt(req.body.redflag)] = req.body.articles;

    console.log("next")
    console.log(req.body.articles)
    console.log("------------------")
    console.log(sess.Qd1)
    console.log(sess.Qd2)

    if(parseInt(req.body.redflag))
      res.redirect("/userstudy/redTLMap");
    else
      res.redirect("/userstudy/redMap");
  });

  app.get("/userstudy/redMap",function(req,res){
    var sess = req.session;
    res.render("userstudy/cohMap",{idx:sess.nowflag,dataset:sess.dataset[sess.nowflag],redflag:1});
  });

  app.get("/userstudy/redTLMap",function(req,res){
    var sess = req.session;
    res.render("userstudy/redTLMap",{idx:sess.nowflag,dataset:sess.dataset[sess.nowflag]});
  });

  app.post("/sendQ3",function(req,res){
    var sess = req.session;

    if(sess.nowflag)
      sess.Qd2[2] = req.body.topics;
    else
      sess.Qd1[2] = req.body.topics;

    console.log("Q3")
    console.log(req.body.topics)
    console.log("------------------")
    console.log(sess.Qd1)
    console.log(sess.Qd2)

    res.redirect("/userstudy/conMap");
  });

  app.get("/userstudy/conMap/",function(req,res){
    var sess = req.session;
    res.render("userstudy/conMap",{idx:sess.nowflag,dataset:sess.dataset[sess.nowflag]});
  });

  app.post("/sendQ4",function(req,res){
    var sess = req.session;


        console.log("Q4")
        console.log(req.body.Con_articles)
        console.log("------------------")

    if(sess.nowflag){
      sess.Qd2[3] = req.body.Con_articles;
      console.log(sess.Qd1)
      console.log(sess.Qd2)
      res.redirect("/userstudy/finish")
    }
    else{
      sess.Qd1[3] = req.body.Con_articles;
      console.log(sess.Qd1)
      console.log(sess.Qd2)
      sess.nowflag = sess.nowflag+1;
      res.redirect("/userstudy/eachMap")
    }
  });

  app.get("/userstudy/finish",function(req,res){
    res.render("userstudy/finish");
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
