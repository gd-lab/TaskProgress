var childProcess = require("child_process");

function JobManager() {
    this.jobModule = "../server/jobs/heavyJob";
    this.jobNumber = 0;
    this.jobHandler = null;
    this.jobProgress = 0;
    this.instance = null;
    this.listeners = {};
}

JobManager.getInstance = function() {
    if (!this.instance) {
        this.instance = new JobManager();
    }
    
    return this.instance;
};

JobManager.prototype.removeEventListener = function(eventName, handler) {
    if (eventName in this.listeners) {
        var index = this.listeners[eventName].indexOf(handler);
        this.listeners[eventName].splice(index, 1);
    }
};

JobManager.prototype.addEventListener = function(eventName, handler) {
    if (!(eventName in this.listeners)) {
        this.listeners[eventName] = [];
    }
    
    this.listeners[eventName].push(handler);
};

JobManager.prototype.notyfyListeners = function(eventName, eventData) {
    if (eventName in this.listeners) {
        var i = 0;
        
        for (i; i < this.listeners[eventName].length; i++) {
            this.listeners[eventName][i]({name: eventName, data: eventData})
        }
    }
};

JobManager.prototype.getCurrentJobProgress = function() {
    return this.jobProgress;
};

JobManager.prototype.getCurrentJobData = function() {
    return {progress: this.jobProgress, taskId: this.jobNumber}
};

JobManager.prototype.start = function() {
    if (this.jobHandler) {
        this.jobHandler.kill();
    }
    
    this.jobHandler = childProcess.fork(this.jobModule);
    
    this.jobHandler.on("message", function(progress) {
        this.jobProgress = progress;
        this.notyfyListeners("progress", this.getCurrentJobData());
    }.bind(this));
    
    this.jobNumber += 1;
    
    return this.jobNumber;
};

module.exports = JobManager.getInstance();
