var express = require("express");
var morgan = require("morgan");
var app = express();

var config = require("./server/config");

app.use(morgan("dev"));
// Register express server routes.
require("./server/router")(app);

app.listen(config.applicationPort, function () {
  console.log("Application is running on port - ", config.applicationPort);
});

process.on("uncaughtException", function (err) {
  // This should not happen
  console.error("Pheew ...! Something unexpected happened. This should be handled more gracefully. I am sorry. The culprit is: ", err);
});