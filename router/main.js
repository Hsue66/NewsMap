var fs = require("fs");
var ObjectID = require('mongodb').ObjectID;
const url = require('url');

var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '.json');
  }
});
var upload = multer({ storage: storage });


module.exports = function(app,News,Users,Datasets){

  app.get("/",function(req,res){
    res.render("mainT");
    //res.render("main");   // 원래 main - 검색기반
  });

  // main에서 dropdown list에서 선택 시,
  app.get("/searchT",function(req,res){
    var sQuery = req.query.sQuery;
    //console.log(sQuery);
    res.render("searchT",{sQuery : sQuery});
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

  app.get('/news', function(req,res){
    News.find({id:"088-0000516274"}, function(err, news){
      if(err) return res.status(500).send({error: 'database failure'});
      res.json(news);
    });
  });

  app.get("/userstudy",function(req,res){
    var passed = req.query.err;
    console.log(passed)
    res.render('userstudy/login',{passed:passed});
  });

  app.get("/userstudy/bestMap",function(req,res){
    var sess = req.session;
    console.log(sess.dataset)
    res.render("userstudy/bestMap",{topic:sess.topic, dataset:sess.dataset});
  });

  app.post("/sendQ1",function(req,res){
    var sess = req.session;
    if(req.body.Map === 'MapA')
      sess.Qd12 = sess.dataset[0];
    else
      sess.Qd12 = sess.dataset[1];
    console.log(sess.Qd12)
    res.redirect("/userstudy/eachMap");
  });

  app.get('/userstudy/eachMap',function(req,res){
    var sess = req.session;
    res.render("userstudy/eachMap",{now:sess.nowflag,con:sess.conflag[sess.nowflag]});
  });

  app.get("/userstudy/cohMap",function(req,res){
    var sess = req.session;
    res.render("userstudy/cohMap",{idx:sess.nowflag,dataset:sess.dataset[sess.nowflag],redflag:0});
  });

  app.post("/sendQ2",function(req,res){
    var sess = req.session;

    if(sess.nowflag){
      sess.Qd2[parseInt(req.body.redflag)] = req.body.articles;
      sess.Qd2num[parseInt(req.body.redflag)] = parseInt(req.body.articlesN);
    }
    else{
      sess.Qd1[parseInt(req.body.redflag)] = req.body.articles;
      sess.Qd1num[parseInt(req.body.redflag)] = parseInt(req.body.articlesN);
    }
    console.log("next")
    console.log(req.body.articles)
    console.log(parseInt(req.body.articlesN))
    console.log("------------------")
    console.log(sess.Qd1)
    console.log(sess.Qd1num)
    console.log(sess.Qd2)
    console.log(sess.Qd2num)

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

    if(sess.nowflag){
      sess.Qd2[2] = req.body.topics;
      sess.Qd2num[2] = parseInt(req.body.topicsN);
    }
    else{
      sess.Qd1[2] = req.body.topics;
      sess.Qd1num[2] = parseInt(req.body.topicsN);
    }
    console.log("Q3")
    console.log(req.body.topics)
    console.log(req.body.topicsN)
    console.log("------------------")
    console.log(sess.Qd1)
    console.log(sess.Qd1num)
    console.log(sess.Qd2)
    console.log(sess.Qd2num)

    if(sess.conflag[sess.nowflag]){
      if(sess.nowflag){
        sess.Qd2[3] = '';
        sess.Qd2num[3] = 0;
      }
      else {
        sess.Qd1[3] = '';
        sess.Qd1num[3] = 0;
      }
      sess.nowflag = sess.nowflag+1;
      if(sess.nowflag === 2)
        res.redirect("/userstudy/finish");
      else
        res.redirect("/userstudy/eachMap");
    }
    else
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
    console.log(req.body.Con_articlesN)
    console.log("------------------")

    if(sess.nowflag){
      sess.Qd2[3] = req.body.Con_articles;
      sess.Qd2num[3] = parseInt(req.body.Con_articlesN);
      console.log(sess.Qd1)
      console.log(sess.Qd1num)
      console.log(sess.Qd2)
      console.log(sess.Qd2num)
      sess.nowflag = sess.nowflag+1;
      res.redirect("/userstudy/finish")
    }
    else{
      sess.Qd1[3] = req.body.Con_articles;
      sess.Qd1num[3] = parseInt(req.body.Con_articlesN);
      console.log(sess.Qd1)
      console.log(sess.Qd1num)
      console.log(sess.Qd2)
      console.log(sess.Qd2num)
      sess.nowflag = sess.nowflag+1;
      res.redirect("/userstudy/eachMap")
    }
  });

  app.get("/userstudy/finish",function(req,res){
    var sess = req.session;
    console.log(sess);
    if(sess.nowflag === 2){
      console.log("save "+sess.userid);
      var updateV = {
        "bestMap": sess.Qd12,
        "eachMap": {
                    "dataset1":sess.Qd1,
                    "dataset2":sess.Qd2
                  },
        "nowflag": 2
      };
      var insertV = [];
      insertV[0] = {
        "userId": sess.userid,
        "datasetId": sess.dataset[0],
        "incohA": sess.Qd1num[0],
        "recurA": sess.Qd1num[1],
        "recurT": sess.Qd1num[2],
        "connA": sess.Qd1num[3]
      };
      insertV[1] = {
        "userId": sess.userid,
        "datasetId": sess.dataset[1],
        "incohA": sess.Qd2num[0],
        "recurA": sess.Qd2num[1],
        "recurT": sess.Qd2num[2],
        "connA": sess.Qd2num[3]
      };

      for(var i=0; i<2; i++){
        Datasets.updateOne({'userId':sess.userid, "datasetId":sess.dataset[i]},{$set:insertV[i]},{upsert:true},function(err,res){
          if(err)
            console.log(err);
          else {
            console.log("saved "+sess.dataset[i]);
          }
        });
      }

      Users.updateOne({'_id':ObjectID(sess.userid)},{$set:updateV},function(err,res){
        if(err)
          console.log(err);
        else {
          console.log("saved");
        }
      });
    }

    res.render("userstudy/finish");
  });

  app.post("/login",function(req,res){
    var username = req.body.id;
    var sess = req.session;

    console.log(username)
    Users.find({"id":username}, function(err, userinfo){
      if(err || userinfo.length === 0){
        console.log(err);
        res.redirect(url.format({pathname:"/userstudy",query:{'err':3}}));
      }else if(userinfo[0].nowflag === 2){
        res.redirect(url.format({pathname:"/userstudy",query:{'err':2}}));
      }
      else{
        sess.userid = userinfo[0]._id;
        sess.dataset = userinfo[0].dataset;
        sess.topic = userinfo[0].topic;
        sess.Qd12 = "";
        sess.Qd1 = [];
        sess.Qd2 = [];
        sess.Qd1num = [];
        sess.Qd2num = [];
        sess.nowflag = userinfo[0].nowflag;
        sess.conflag = userinfo[0].conflag;
        res.redirect("/userstudy/prev");
      }
    });
  });

  app.get("/userstudy/prev",function(req,res){
    res.render("userstudy/prev");
  });

  var calcData = {
    'greece debt':{
      'greece2.json':{'incohA':0, 'recurA':0, 'recurT':0, 'connA':0, 'best':0, 'nodes':9, 'tls':2 },
      'greece.json':{'incohA':0, 'recurA':0, 'recurT':0, 'connA':0, 'best':0, 'nodes':14, 'tls':4 }
    },
    'pohang earthquake':{
      'dcData.json':{'incohA':0, 'recurA':0, 'recurT':0, 'connA':0, 'best':0, 'nodes':4, 'tls':1 },
      'Data.json':{'incohA':0, 'recurA':0, 'recurT':0, 'connA':0, 'best':0, 'nodes':4, 'tls':1 }
    }
  };

  app.get("/userstudy/result",function(req,res){
    for(var topic in calcData){
      for(var dataset in calcData[topic]){
        calcBest(topic, dataset);
        calcAll(topic, dataset);
      }
    }
    console.log(calcData)

    res.render("userstudy/result",{data:calcData});
  });

  var calcBest = function(topic,dId){
    Users.countDocuments({"topic":topic,"bestMap":dId}, function(err, num){
      if(err)
        console.log(err);
      else
        calcData[topic][dId].best = num;
    });
  }

  var calcAll = function(topic, dId){
    Datasets.aggregate([
      { $match: {
          datasetId: dId
      }},
      { $group : {
        _id:'null',
        incohA: { $sum : "$incohA"},
        recurA: { $sum : "$recurA"},
        recurT: { $sum : "$recurT"},
        connA: { $sum : "$connA"},
        count: { $sum : 1 }
      }}
    ], function(err,result){
      if(err)
        console.log(err);
      else{
        var base = (result[0].count*calcData[topic][dId].nodes);
        calcData[topic][dId].incohA = result[0].incohA/base;
        calcData[topic][dId].recurA = result[0].recurA/base;
        calcData[topic][dId].connA = result[0].connA/base;
        calcData[topic][dId].recurT = result[0].recurT/(result[0].count*calcData[topic][dId].tls);
      }
    });
  }

  app.get("/upload",function(req,res){
    res.render("upload");
  });

  var convert = require("./convert.js");
  var UploadFiles = upload.fields([{ name: 'dataset'}, { name: 'sample'}]);

  app.post('/upload',UploadFiles, function(req,res){
    convert.convert(fs);
    var output = `<a href="/demo">생성된 Map보기</a>`
    res.send(output);
  });

  app.get("/demo",function(req,res){
    res.render("demo");
  });

  app.get("*",function(req,res){
    res.render("wrong");
  });

}
