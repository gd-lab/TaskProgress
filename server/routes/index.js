var express = require("express");
var router = express.Router();

var barController = require("../controllers/bar");
var jobController = require("../controllers/job");

router.get("/bar", barController.index);

router.get("/job/progress", jobController.progress);
router.get("/job/start", jobController.start);

module.exports = router;