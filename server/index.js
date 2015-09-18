var server = require("http").createServer()
var path = require("path");

var express = require("express");
var ws = require("ws");

var routes = require("./routes");
var wsJobCommunicationPipe = require("./lib/wsJobCommunicationPipe");

var wss = new ws.Server({ server: server });
wsJobCommunicationPipe(wss);

app = express();

var staticDir = path.resolve(__dirname + "/../client");
app.use(express.static(staticDir));

app.use("/", routes);
app.all("/", function(req, res) {
    res.redirect("/bar");
});

server.on("request", app);
server.listen("8080");
