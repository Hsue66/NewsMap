/***********************************************************************
  TopicMap : Web application for visualizing a news map generated by TopicMaps
  Authors: Sumin Hong (hsue0606@gmail.com), U Kang (ukang@snu.ac.kr)
  Data Mining Lab., Seoul National University

-------------------------------------------------------------------------
File: index.js
 - A route server file of TopicMap.

Version: 1.0
***********************************************************************/

// Load the required modules that the router needs.
var router = require('express').Router();
var controller = require('./controller');
var userstudy = require('./ctrluserstudy');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },filename: function (req, file, cb) {
    cb(null, file.fieldname + '.json');
  }
});
var upload = multer({ storage: storage });


// Specifies a handler for http requests coming in from a specific URL.

/**
 * Show main page
 */
router.get("/", controller.main);

/**
 * Show search page
 */
router.get("/search",controller.search);

/**
 * Show upload page
 */
router.get("/upload",controller.upload);

/**
 * Convert the uploaded files to a map and show redirect link
 */
var UploadFiles = upload.fields([{ name: 'dataset'}, { name: 'sample'}]);
router.post('/upload',UploadFiles,controller.uploadAndConvert);

/**
 * Show demo page
 */
router.get("/demo", controller.demo);


/**
 * Show login page
 */
router.get("/userstudy", userstudy.main);

/**
 * Log in with user ID, display the preview page if correct,
 * and display an alert if it is incorrect or already participated.
 */
router.post("/login", userstudy.login);

/**
 * Show preview page
 */
router.get("/userstudy/prev", userstudy.prev);

/**
 * Show eachMap page
 */
router.get('/userstudy/eachMap', userstudy.eachMap);

/**
 * Show bestMap page
 */
router.get("/userstudy/bestMap", userstudy.bestMap);

/**
 * Save selected map to the session and Increase nowflag
 */
router.post("/sendQ1", userstudy.sendQ1);

/**
 * Show cohMap page
 */
router.get("/userstudy/cohMap",userstudy.cohMap);

/**
 * Save incoherent articles or redundant articles to the session and Increase nowflag
 */
router.post("/sendQ2", userstudy.sendQ2);

/**
 * Show redMap page
 */
router.get("/userstudy/redMap", userstudy.redMap);

/**
 * Show redTLMap page
 */
router.get("/userstudy/redTLMap", userstudy.redTLMap);

/**
 * Save redundant timelines to the session and Increase nowflag
 */
router.post("/sendQ3", userstudy.sendQ3);

/**
 * Show conMap page
 */
router.get("/userstudy/conMap/",userstudy.conMap);

/**
 * Save wrong connected articles to session and Increase nowflag
 */
router.post("/sendQ4", userstudy.sendQ4);

/**
 * Show finish page and save the session data to database
 */
router.get("/userstudy/finish", userstudy.finish);

/**
 * Show result page
 */
router.get("/userstudy/result", userstudy.result);

/**
 * Show 404 error page
 */
router.get("*", controller.wrong);

module.exports = router;
