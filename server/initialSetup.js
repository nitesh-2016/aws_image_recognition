var config = require("./config");
var AWS = require("aws-sdk");
AWS.config.region = config.region;
var rekognition = new AWS.Rekognition({region: config.region});
var s3 = new AWS.S3();

function createS3Bucket() {
  console.log("deleting existing s3 bucket - ");
  s3.deleteBucket({Bucket: config.s3Bucket}, (err, data) => {
    if (err) {
      console.error("error - ", err.stack); // an error occurred
    } else {
      console.log("success - ", data); // successful response
    }
    console.log("creating new s3 bucket - ");
    s3.createBucket({Bucket: config.s3Bucket}, (err, data) => {
      if (err) {
        console.log("err - ", err.stack); // an error occurred
      } else {
        console.log("success - ", data); // successful response
      }
    });
  });
}

function createFaceCollection() {
  console.log("deleting existing face collection - ");
  rekognition.deleteCollection({"CollectionId": config.collection}, (err, data) => {
    if (err) {
      console.error("error - ", err.stack); // an error occurred
    } else {
      console.log("success - ", data); // successful response
    }
    console.log("creating new face collection - ");
    rekognition.createCollection({"CollectionId": config.collection}, (err, data) => {
      if (err) {
        console.log("err - ", err.stack); // an error occurred
      } else {
        console.log("success - ", data); // successful response
      }
    });
  });
}

/** Note - uncomment below lines 1-by-1 on need basis.
 *  1. createFaceCollection() - To delete existing face collection and create a new one.
 *  2. createS3Bucket() - To delete existing s3 bucket and create a new one.
 */

// createFaceCollection();
// createS3Bucket();