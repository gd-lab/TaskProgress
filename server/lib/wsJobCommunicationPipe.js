var jobManager = require("../lib/jobManager");

function WSJobCommunicationPipe (wss) {
    this.wss = wss;
    this.setHandlers();
    this.wssAllowedActions = [
        "getJobStatus",
        "subscribeJobUpdates"
    ];
};

WSJobCommunicationPipe.prototype.setHandlers = function() {
    this.wss.on("connection", function connection(ws) {
        console.log("WS Connected.");
        ws.on("message", function (message) {
            try {
              message = JSON.parse(message);
            } catch(e) {
              message = {};
            }
            if (typeof(message) === "object"
                && ("action" in message)
                && this[message.action]
                && (~this.wssAllowedActions.indexOf(message.action))
            ) {
              this[message.action](ws, message);
            }
        }.bind(this));
    }.bind(this));
};

WSJobCommunicationPipe.prototype.subscribeJobUpdates = function(ws, message) {
    
    var f = function(event) {
        ws.send(JSON.stringify({action: message.action, id: message.id, data: event.data}), function err(e) {
            if (e) {
                jobManager.removeEventListener("progress", f);
            }
        });
    };
    
    jobManager.addEventListener("progress", f);
};

WSJobCommunicationPipe.prototype.getJobStatus = function(ws, message) {
    ws.send(JSON.stringify({action: message.action, id: message.id, data: jobManager.getCurrentJobData()}), function err(e) {
        if (e) {
            console.log("WSJobCommunicationPipe Error!", e);
        }
    });
};

module.exports = function(wss) {
    return new WSJobCommunicationPipe(wss);
};