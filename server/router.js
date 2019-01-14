// Import dependencies.
var multer = require("multer")();
var express = require("express");
var path = require("path");
var awsService = require("./awsService");

module.exports = function (app) {
  // Load the UI files.
  app.use(express.static(path.resolve(__dirname + "/../"  + "/client")));

  // Register /api/recognize endpoint for HTTP POST method.
  app.post("/api/recognize", multer.single("image"), (req, res) => {
    awsService.matchFaces(req.file, (error, response) => {
      if (error) {
        res.status(500).json({error: error});
      } else {
        res.status(200).json(response);
      }
    });
  });
};