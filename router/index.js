var router = require('express').Router();
var controller = require('./controller');
var userstudy = require('./ctrluserstudy');

// Load the required modules that the router needs.
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },filename: function (req, file, cb) {
    cb(null, file.fieldname + '.json');
  }
});
var upload = multer({ storage: storage });


/**
 * Show main page
 *
 * @return 'main' page.
 */
router.get("/", controller.main);

/**
 * Show search page
 *
 * @return 'search' page.
 */
router.get("/search",controller.search);

/**
 * Show upload page
 *
 * @return 'upload' page.
 */
router.get("/upload",controller.upload);

/**
 * Convert the uploaded files to a map and show redirect link
 *
 * @return 'upload' page.
 */

var UploadFiles = upload.fields([{ name: 'dataset'}, { name: 'sample'}]);
router.post('/upload',UploadFiles,controller.uploadAndConvert);

/**
 * Show demo page
 *
 * @return 'demo' page.
 */
router.get("/demo", controller.demo);


/**
 * Show login page
 *
 * @return 'userstudy/login' page.
 */
router.get("/userstudy", userstudy.main);

/**
 * Log in with the user ID and show preview page if it is correct
 * and show alert if it is wrong or already participated.
 *
 * @return 'userstudy/prev' page or alert in userstudy/login page
 */
router.post("/login", userstudy.login);

/**
 * Show preview page
 *
 * @return 'userstudy/prev' page.
 */
router.get("/userstudy/prev", userstudy.prev);

/**
 * Show eachMap page
 *
 * @return 'userstudy/eachMap' page.
 */
router.get('/userstudy/eachMap', userstudy.eachMap);

/**
 * Show bestMap page
 *
 * @return 'userstudy/bestMap' page.
 */
router.get("/userstudy/bestMap", userstudy.bestMap);

/**
 * Save selected map to session and Increase nowflag
 *
 * @return redirect to 'userstudy/eachMap' page.
 */
router.post("/sendQ1", userstudy.sendQ1);

/**
 * Show cohMap page
 *
 * @return 'userstudy/cohMap' page.
 */
router.get("/userstudy/cohMap",userstudy.cohMap);

/**
 * Save incoherent nodes or redundant nodes to session and Increase nowflag
 *
 * @return If you tested both maps on coherence and redundancy test, redirect to 'userstudy/eachMap'
           If you tested first map without redflag, redirect to 'userstudy/cohMap'
           If you tested first map with redflag, redirect to 'userstudy/redMap'
 */
router.post("/sendQ2", userstudy.sendQ2);

/**
 * Show cohMap page
 *
 * @return 'userstudy/cohMap' page.
 */
router.get("/userstudy/redMap", userstudy.redMap);

/**
 * Show redTLMap page
 *
 * @return 'userstudy/redTLMap' page.
 */
router.get("/userstudy/redTLMap", userstudy.redTLMap);

/**
 * Save redundant edges to session and Increase nowflag
 *
 * @return If you tested both maps, redirect to 'userstudy/eachMap'
           If you tested first map, redirect to 'userstudy/redTLMap'
 */
router.post("/sendQ3", userstudy.sendQ3);

/**
 * Show conMap page
 *
 * @return 'userstudy/conMap' page.
 */
router.get("/userstudy/conMap/",userstudy.conMap);

/**
 * Save wrong connected nodes to session and Increase nowflag
 *
 * @return If you tested both maps, redirect to 'userstudy/finish'
           If you tested first map, redirect to 'userstudy/conMap'
 */
router.post("/sendQ4", userstudy.sendQ4);

/**
 * Show finish page and save session data to database
 *
 * @return 'userstudy/finish' page.
 */
router.get("/userstudy/finish", userstudy.finish);

/**
 * Show result page
 *
 * @return 'userstudy/result' page.
 */
router.get("/userstudy/result", userstudy.result);

/**
 * Show 404 page
 *
 * @return 'wrong' page.
 */
router.get("*", controller.wrong);

module.exports = router;
