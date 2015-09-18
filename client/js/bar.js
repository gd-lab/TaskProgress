function Bar(doc) {
    this.value = 0;
    this.barWrapper = null;
    this.progressBar = null;
    this.doc = doc;
}

Bar.prototype.init = function(rootElem) {
    var bar = this.createMarkup();
    rootElem.appendChild(bar);
}

Bar.prototype.createMarkup = function() {
    this.barWrapper = this.doc.createElement("DIV");
    this.barWrapper.className = "barWrapper";
    
    this.progressBar = this.doc.createElement("DIV");
    this.progressBar.className = "bar";
    
    this.barWrapper.appendChild(this.progressBar);
    
    return this.barWrapper;
}

Bar.prototype.wsMessageHandler = function(message) {
    if (message.action === "subscribeJobUpdates") {
        this.setProgress(message.data.progress);
    }
}

Bar.prototype.setProgress = function(progress) {
    this.progressBar.style.width = progress + "%";
    this.progressBar.innerHTML = progress + "%";
}