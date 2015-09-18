    function WSManager(address, connectionHandler) {
    this.address = address;
    this.connection = null;
    this.lastError = null;
    this.subscribers = [];
    this.connectionHandler = connectionHandler || function(){};
    
    this.init();
}

WSManager.prototype.init = function() {
    this.connection = new WebSocket(this.address);
    this.connection.onopen = this.connectionHandler.bind(this, this);
    this.connection.onerror = this.onError.bind(this);
    this.connection.onmessage = this.onMessage.bind(this);
}

WSManager.prototype.onError = function(error) {
    console.log("WS Error", error);
    this.lastError = error;
}

WSManager.prototype.onMessage = function(message) {
    var error = false;
    
    try {
        message = JSON.parse(message.data);
    } catch(e) {
        error = true;
    }
    
    if (!error) {
        this.notyfySubscribers(message);
    }
}

WSManager.prototype.notyfySubscribers = function(message) {
    var i = 0;
    
    for (i; i<this.subscribers.length; i++) {
        this.subscribers[i](message);
    }
}

WSManager.prototype.subscribe = function(handler) {
    this.subscribers.push(handler);
}

WSManager.prototype.unsubscribe = function(handler) {
    var index = this.subscribers.indexOf(handler);
    
    if (~index) {
        this.subscribers.splice(index, 1);
    }
}

WSManager.prototype.sendMessage = function(message) {
    this.connection.send(JSON.stringify(message));
}