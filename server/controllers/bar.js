var path = require("path");

function BarController() {
    
}

BarController.prototype.index = function(req, res, next) {
    res.sendFile(path.resolve(__dirname + "/../views/bar.html"));
};

module.exports = new BarController();