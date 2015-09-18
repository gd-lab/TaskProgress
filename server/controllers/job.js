var jobManager = require("../lib/jobManager");

function JobController() {

}

JobController.prototype.progress = function(req, res, next) {
    res.send(jobManager.getCurrentJobData());
};

JobController.prototype.start = function(req, res, next) {
    var jobId = jobManager.start();
    res.send("Job " + jobId + " started.");
    
};

module.exports = new JobController();