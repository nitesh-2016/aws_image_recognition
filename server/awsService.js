/**
 * Import dependencies.
 */
var config = require("./config");
var stream = require("stream");
var AWS = require("aws-sdk");
AWS.config.region = config.region;
var rekognition = new AWS.Rekognition({region: config.region});
var s3 = new AWS.S3();

/**
 * Function to upload an uploaded image in s3 bucket.
 * @param imgBuffer - Image as buffer.
 * @param faceId - Unique id of the rekognition face.
 * @param next - returns acknowledgement(success/error)
 */
function uploadFaceInS3Bucket(imgBuffer, faceId, next) {
  var readStream = new stream.Readable;
  readStream.push(imgBuffer);
  readStream.push(null);
  const params = {
    Bucket: config.s3Bucket,
    Key: faceId,
    Body: readStream
  };
  s3.upload(params, next);
}

/**
 * Function to register(index) a new image in aws S3 bucket.
 * @param file - Image file object.
 * @param next - returns error or success response.
 */
function registerFace(file, next) {
  var imgBuffer = file.buffer;

  rekognition.indexFaces({
    "CollectionId": config.collection,
    "DetectionAttributes": ["ALL"],
    "Image": {
      "Bytes": imgBuffer
    }
  }, (err, data) => {
    if (err) {
      console.error(err, err.stack); // an error occurred
    } else if (data && data.FaceRecords && data.FaceRecords.length) {
      // Insert new face in s3 bucket.
      let indexedFaceData = data.FaceRecords[0];
      let faceId = indexedFaceData.Face.FaceId;
      uploadFaceInS3Bucket(imgBuffer, faceId, next);
    }
  });
}

/**
 * Function to get image from S3 bucket using imageId.
 * @param faceId - unique id of the stored face.
 * @param file - Image file object.
 * @param next - returns error or success response.
 */
function getMatchedFaceFromS3Bucket(faceId, file, next) {
  s3.getObject({
    "Bucket": config.s3Bucket,
    "Key": faceId
  }, (error, response) => {
    if (response && response.Body) {
      next(null, {matchedFace: response.Body.toString('base64')});
    } else {
      uploadFaceInS3Bucket(file.buffer, faceId, (err, data) => {
        if (!err) {
          console.log("S3 upload successful - ", data); // successful response
        } else {
          console.error("S3 upload error - ", err); // successful response
        }
        next(null, "No match found. Registered face for future searches !!!");
      });
    }
  });
}

/**
 * Function to search matching image in aws S3 bucket.
 * @param file - Image file object.
 * @param next - Callback function to return error or response.
 */
exports.matchFaces = function (file, next) {
  rekognition.searchFacesByImage({
    "CollectionId": config.collection,
    "FaceMatchThreshold": 70,
    "Image": {
      "Bytes": file.buffer,
    },
    "MaxFaces": 1
  }, function (err, data) {
    if (err) {
      next(err, null);
    } else {
      if (data.FaceMatches && data.FaceMatches.length > 0 && data.FaceMatches[0].Face) {
        let faceId = data.FaceMatches[0].Face.FaceId;
        getMatchedFaceFromS3Bucket(faceId, file, next);
      } else {
        registerFace(file, (err, data) => {
          if (!err) {
            console.log("S3 upload successful - ", data); // successful response
          } else {
            console.error("S3 upload error - ", err); // successful response
          }
          next(null, "No match found. Registered face for future searches !!!");
        });
      }
    }
  });
};