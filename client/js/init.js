function updateLog(str) {
    var logPlace = document.getElementById("log");
    if (logPlace) {
        logPlace.innerHTML = str;
    }
}

function startJob() {
    var xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return;
        
        if (xhr.status == 200) {
            updateLog(xhr.responseText);
        } else {
            updateLog("Error. Status: " + xhr.status);
        }
    }
    
    xhr.open("GET", "http://localhost:8080/job/start");
    xhr.send();
}

function getJobStatus(wsManager) {
    wsManager.sendMessage({action: "getJobStatus"});
}

function init() {
    var wsManager = new WSManager("ws://localhost:8080", function(self) {
        self.sendMessage({action: "subscribeJobUpdates"});
    });
    
    var bar = new Bar(document);
    bar.init(document.body);
    
    var f = bar.wsMessageHandler.bind(bar);
    wsManager.subscribe(f);
    
    var startButton = document.getElementById("start");
    startButton.addEventListener("click", startJob);
    
    var getStatusButton = document.getElementById("status");
    getStatusButton.addEventListener("click", getJobStatus.bind(getStatusButton, wsManager));
    
    wsManager.subscribe(function(message) {
        if (message.action === "getJobStatus") {
            updateLog(JSON.stringify(message.data));
        }
    });
}

document.addEventListener("DOMContentLoaded", init);