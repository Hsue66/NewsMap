/***********************************************************************
  TopicMap : a Web application for people who want to generate and visualize news map.
  Authors: Sumin Hong(hsue0606@gmail.com), U Kang (ukang@snu.ac.kr)
  Data Mining Lab., Seoul National University

This software is free of charge under research purposes.
For commercial purposes, please contact the authors.

-------------------------------------------------------------------------
File: main.js
 - A router file of TopicMap.

Version: 1.0
***********************************************************************/

var fs = require("fs");
var ObjectID = require('mongodb').ObjectID;
const url = require('url');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },filename: function (req, file, cb) {
    cb(null, file.fieldname + '.json');
  }
});
var upload = multer({ storage: storage });


module.exports = function(app,Users,Datasets){

  app.get("/",function(req,res){
    res.render("main");
  });

  // main에서 dropdown list에서 선택 시,
  app.get("/search",function(req,res){
    var sQuery = req.query.sQuery;
    res.render("search",{sQuery : sQuery});
  });

/**
 * Show login page
 *
 * @param req
 *            req.query.err
 * @return 'userstudy/login' page.
 */
  app.get("/userstudy",function(req,res){
    var passed = req.query.err;
    // console.log(passed)
    res.render('userstudy/login',{passed:passed});
  });

  /**
   * Show preview page
   *
   * @return 'userstudy/prev' page.
   */
  app.get("/userstudy/prev",function(req,res){
    res.render("userstudy/prev");
  });

  /**
   * Show eachMap page
   *
   * @return 'userstudy/eachMap' page.
   */
  app.get('/userstudy/eachMap',function(req,res){
    var sess = req.session;
    res.render("userstudy/eachMap",{now:sess.nowflag});
  });

  /**
   * Show bestMap page
   *
   * @return 'userstudy/bestMap' page.
   */
  app.get("/userstudy/bestMap",function(req,res){
    var sess = req.session;
    res.render("userstudy/bestMap",{topic:sess.topic, dataset:sess.dataset});
  });

  /**
   * Save selected map to session and Increase nowflag
   *
   * @return redirect to 'userstudy/eachMap' page.
   */
  app.post("/sendQ1",function(req,res){
    var sess = req.session;
    if(req.body.Map === 'MapA')
      sess.Qd12 = sess.dataset[0];
    else
      sess.Qd12 = sess.dataset[1];
    // console.log(sess.Qd12)

    sess.nowflag = sess.nowflag+1;
    res.redirect("/userstudy/eachMap");
  });

  /**
   * Show cohMap page
   *
   * @return 'userstudy/cohMap' page.
   */
  app.get("/userstudy/cohMap",function(req,res){
    var sess = req.session;
    res.render("userstudy/cohMap",{topic:sess.topic,now:sess.nowflag,idx:sess.dataflag,dataset:sess.dataset[sess.dataflag],redflag:0});
  });

  /**
   * Save incoherent nodes or redundant nodes to session and Increase nowflag
   *
   * @return If you tested both maps on coherence and redundancy test, redirect to 'userstudy/eachMap'
             If you tested first maps without redflag, redirect to 'userstudy/cohMap'
             If you tested first maps with redflag, redirect to 'userstudy/redMap'
   */
  app.post("/sendQ2",function(req,res){
    var sess = req.session;

    if(sess.dataflag){
      sess.Qd2[parseInt(req.body.redflag)] = req.body.articles;
      sess.Qd2num[parseInt(req.body.redflag)] = parseInt(req.body.articlesN);
    }
    else{
      sess.Qd1[parseInt(req.body.redflag)] = req.body.articles;
      sess.Qd1num[parseInt(req.body.redflag)] = parseInt(req.body.articlesN);
    }

    if(sess.dataflag){
      sess.dataflag = 0;
      sess.nowflag = sess.nowflag +1;
      res.redirect("/userstudy/eachMap");
    }
    else{
      sess.dataflag = 1;
      if(parseInt(req.body.redflag)===1)
        res.redirect("/userstudy/redMap");
      else
        res.redirect("/userstudy/cohMap");
    }
  });

  app.get("/userstudy/redMap",function(req,res){
    var sess = req.session;
    res.render("userstudy/cohMap",{topic:sess.topic,now:sess.nowflag,idx:sess.dataflag,dataset:sess.dataset[sess.dataflag],redflag:1});
  });

  app.get("/userstudy/redTLMap",function(req,res){
    var sess = req.session;
    res.render("userstudy/redTLMap",{topic:sess.topic,now:sess.nowflag,idx:sess.dataflag,dataset:sess.dataset[sess.dataflag]});
  });

  app.post("/sendQ3",function(req,res){
    var sess = req.session;

    if(sess.dataflag){
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

    if(sess.dataflag){
      sess.dataflag = 0;
      sess.nowflag = sess.nowflag +1;
      res.redirect("/userstudy/eachMap");
    }else{
      sess.dataflag = 1;
      res.redirect("/userstudy/redTLMap");
    }
    // if(sess.conflag[sess.nowflag]){
    //   if(sess.nowflag){
    //     sess.Qd2[3] = '';
    //     sess.Qd2num[3] = 0;
    //   }
    //   else {
    //     sess.Qd1[3] = '';
    //     sess.Qd1num[3] = 0;
    //   }
    //   sess.nowflag = sess.nowflag+1;
    //   if(sess.nowflag === 2)
    //     res.redirect("/userstudy/finish");
    //   else
    //     res.redirect("/userstudy/eachMap");
    // }
    // else
    //   res.redirect("/userstudy/conMap");
  });

  app.get("/userstudy/conMap/",function(req,res){
    var sess = req.session;
    res.render("userstudy/conMap",{topic:sess.topic,con:sess.conflag[sess.dataflag],now:sess.nowflag,idx:sess.dataflag,dataset:sess.dataset[sess.dataflag]});
  });

  app.post("/sendQ4",function(req,res){
    var sess = req.session;

    console.log("Q4")
    console.log(req.body.Con_articles)
    console.log(req.body.Con_articlesN)
    console.log("------------------")

    if(sess.dataflag){
      sess.Qd2[3] = req.body.Con_articles;
      sess.Qd2num[3] = parseInt(req.body.Con_articlesN);
      console.log(sess.Qd1)
      console.log(sess.Qd1num)
      console.log(sess.Qd2)
      console.log(sess.Qd2num)
      //sess.nowflag = sess.nowflag+1;
      //res.redirect("/userstudy/finish")
    }
    else{
      sess.Qd1[3] = req.body.Con_articles;
      sess.Qd1num[3] = parseInt(req.body.Con_articlesN);
      console.log(sess.Qd1)
      console.log(sess.Qd1num)
      console.log(sess.Qd2)
      console.log(sess.Qd2num)
      //sess.nowflag = sess.nowflag+1;
      //res.redirect("/userstudy/eachMap")
    }
    if(sess.dataflag){
      sess.nowflag = sess.nowflag +1;
      res.redirect("/userstudy/finish");
    }else{
      sess.dataflag = 1;
      res.redirect("/userstudy/conMap");
    }
  });

  app.get("/userstudy/finish",function(req,res){
    var sess = req.session;
    console.log(sess);
    if(sess.nowflag === 5){
      console.log("save "+sess.userid);
      var updateV = {
        "bestMap": sess.Qd12,
        "eachMap": {
                    "dataset1":sess.Qd1,
                    "dataset2":sess.Qd2
                  },
        "nowflag": 5
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

  /**
   * Log in with the user ID and show preview page if it is correct
   * and show alert if it is wrong or already participated.
   *
   * @param req
   *            req.body.id : User's login ID value
   *            req.session : User's session
   * @return 'userstudy/prev' page or alert in userstudy/login page
   */
  app.post("/login",function(req,res){
    var username = req.body.id;
    var sess = req.session;

    // console.log(username)
    Users.find({"id":username}, function(err, userinfo){
      if(err || userinfo.length === 0){       // wrong id
        console.log(err);
        res.redirect(url.format({pathname:"/userstudy",query:{'err':3}}));
      } else if(userinfo[0].nowflag === 5){   // alredy participated
        res.redirect(url.format({pathname:"/userstudy",query:{'err':2}}));
      } else{                                 // correct - establish session
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
        sess.dataflag = 0;
        res.redirect("/userstudy/prev");
      }
    });
  });



  var calcData = {
    '포항 지진':{
      'pohang1.json':{'incohA':0, 'recurA':0, 'recurT':0, 'connA':0, 'best':0, 'nodes':23, 'tls':5, 'cons':2 },
      'pohang2.json':{'incohA':0, 'recurA':0, 'recurT':0, 'connA':0, 'best':0, 'nodes':19, 'tls':5, 'cons':3 }
    },
    '북한관련 국내외 정세':{
      'baby1.json':{'incohA':0, 'recurA':0, 'recurT':0, 'connA':0, 'best':0, 'nodes':15, 'tls':4, 'cons':5},
      'baby2.json':{'incohA':0, 'recurA':0, 'recurT':0, 'connA':0, 'best':0, 'nodes':16, 'tls':4,'cons':2 }
    },
    '랜섬웨어':{
      'ransom2.json':{'incohA':0, 'recurA':0, 'recurT':0, 'connA':0, 'best':0, 'nodes':11, 'tls':3 ,'cons':2},
      'ransom1.json':{'incohA':0, 'recurA':0, 'recurT':0, 'connA':0, 'best':0, 'nodes':12, 'tls':3, 'cons':1}
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
        calcData[topic][dId].incohA = 1-(result[0].incohA/base);
        calcData[topic][dId].recurA = 1-(result[0].recurA/base);
        calcData[topic][dId].recurT = 1-(result[0].recurT/(result[0].count*calcData[topic][dId].tls));
        calcData[topic][dId].connA = 1-(result[0].connA/(result[0].count*calcData[topic][dId].cons));
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

  app.get("/upload2",function(req,res){
    res.render("upload2");
  });

  var convert2 = require("./convert2.js");
  var UploadFiles = upload.fields([{ name: 'dataset'}, { name: 'sample'}]);

  app.post('/upload2',UploadFiles, function(req,res){
    convert2.convert(fs);
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
