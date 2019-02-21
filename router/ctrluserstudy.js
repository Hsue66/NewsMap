var Users = require('../models/user');
var Datasets = require('../models/dataset');
var ObjectID = require('mongodb').ObjectID;
var url = require('url');

/**
 * Show login page
 *
 * @return 'userstudy/login' page.
 */
exports.main = function(req,res){
  var passed = req.query.err;
  // console.log(passed)
  res.render('userstudy/login',{passed:passed});
};

/**
 * Log in with the user ID and show preview page if it is correct
 * and show alert if it is wrong or already participated.
 *
 * @return 'userstudy/prev' page or alert in userstudy/login page
 */
exports.login = function(req,res){
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
};

/**
 * Show preview page
 *
 * @return 'userstudy/prev' page.
 */
exports.prev = function(req,res){
  res.render("userstudy/prev");
};


/**
 * Show eachMap page
 *
 * @return 'userstudy/eachMap' page.
 */
exports.eachMap = function(req,res){
  var sess = req.session;
  res.render("userstudy/eachMap",{now:sess.nowflag});
};

/**
 * Show bestMap page
 *
 * @return 'userstudy/bestMap' page.
 */
exports.bestMap = function(req,res){
  var sess = req.session;
  res.render("userstudy/bestMap",{topic:sess.topic, dataset:sess.dataset});
};

/**
 * Save selected map to session and Increase nowflag
 *
 * @return redirect to 'userstudy/eachMap' page.
 */
exports.sendQ1 = function(req,res){
  var sess = req.session;
  if(req.body.Map === 'MapA')
    sess.Qd12 = sess.dataset[0];
  else
    sess.Qd12 = sess.dataset[1];
  // console.log(sess.Qd12)

  sess.nowflag = sess.nowflag+1;
  res.redirect("/userstudy/eachMap");
};

/**
 * Show cohMap page
 *
 * @return 'userstudy/cohMap' page.
 */
exports.cohMap = function(req,res){
  var sess = req.session;
  res.render("userstudy/cohMap",{topic:sess.topic,now:sess.nowflag,idx:sess.dataflag,dataset:sess.dataset[sess.dataflag],redflag:0});
};

/**
 * Save incoherent nodes or redundant nodes to session and Increase nowflag
 *
 * @return If you tested both maps on coherence and redundancy test, redirect to 'userstudy/eachMap'
           If you tested first map without redflag, redirect to 'userstudy/cohMap'
           If you tested first map with redflag, redirect to 'userstudy/redMap'
 */
exports.sendQ2 = function(req,res){
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
};


/**
 * Show cohMap page
 *
 * @return 'userstudy/cohMap' page.
 */
exports.redMap = function(req,res){
  var sess = req.session;
  res.render("userstudy/cohMap",{topic:sess.topic,now:sess.nowflag,idx:sess.dataflag,dataset:sess.dataset[sess.dataflag],redflag:1});
};

/**
 * Show redTLMap page
 *
 * @return 'userstudy/redTLMap' page.
 */
exports.redTLMap = function(req,res){
  var sess = req.session;
  res.render("userstudy/redTLMap",{topic:sess.topic,now:sess.nowflag,idx:sess.dataflag,dataset:sess.dataset[sess.dataflag]});
};

/**
 * Save redundant edges to session and Increase nowflag
 *
 * @return If you tested both maps, redirect to 'userstudy/eachMap'
           If you tested first map, redirect to 'userstudy/redTLMap'
 */
exports.sendQ3 = function(req,res){
  var sess = req.session;

  if(sess.dataflag){
    sess.Qd2[2] = req.body.topics;
    sess.Qd2num[2] = parseInt(req.body.topicsN);
  }
  else{
    sess.Qd1[2] = req.body.topics;
    sess.Qd1num[2] = parseInt(req.body.topicsN);
  }

  if(sess.dataflag){
    sess.dataflag = 0;
    sess.nowflag = sess.nowflag +1;
    res.redirect("/userstudy/eachMap");
  }else{
    sess.dataflag = 1;
    res.redirect("/userstudy/redTLMap");
  }
};

/**
 * Show conMap page
 *
 * @return 'userstudy/conMap' page.
 */
exports.conMap = function(req,res){
  var sess = req.session;
  res.render("userstudy/conMap",{topic:sess.topic,con:sess.conflag[sess.dataflag],now:sess.nowflag,idx:sess.dataflag,dataset:sess.dataset[sess.dataflag]});
};


/**
 * Save wrong connected nodes to session and Increase nowflag
 *
 * @return If you tested both maps, redirect to 'userstudy/finish'
           If you tested first map, redirect to 'userstudy/conMap'
 */
exports.sendQ4 = function(req,res){
  var sess = req.session;
  if(sess.dataflag){
    sess.Qd2[3] = req.body.Con_articles;
    sess.Qd2num[3] = parseInt(req.body.Con_articlesN);
  }
  else{
    sess.Qd1[3] = req.body.Con_articles;
    sess.Qd1num[3] = parseInt(req.body.Con_articlesN);
  }
  if(sess.dataflag){
    sess.nowflag = sess.nowflag +1;
    res.redirect("/userstudy/finish");
  }else{
    sess.dataflag = 1;
    res.redirect("/userstudy/conMap");
  }
};

/**
 * Show finish page and save session data to database
 *
 * @return 'userstudy/finish' page.
 */
exports.finish = function(req,res){
  var sess = req.session;
  // console.log(sess);
  if(sess.nowflag === 5){
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
};

/**
 * Show result page
 *
 * @return 'userstudy/result' page.
 */
exports.result = function(req,res){
  for(var topic in calcData){
    for(var dataset in calcData[topic]){
      calcBest(topic, dataset);
      calcAll(topic, dataset);
    }
  }
  res.render("userstudy/result",{data:calcData});
};

// data for calculate result
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


/**
 * Calculate how many people have selected a 'dId' map as a good map
 *
 * @param topic
 *            topic
 * @param dId
 *            datasetId
 */
var calcBest = function(topic,dId){
  Users.countDocuments({"topic":topic,"bestMap":dId}, function(err, num){
    if(err)
      console.log(err);
    else
      calcData[topic][dId].best = num;
  });
};

/**
 * Calculate  ratio of incohrence article, redundant article, redundant timeline and wrongly connected article.
 *
 * @param topic
 *            topic
 * @param dId
 *            datasetId
 */
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
};
