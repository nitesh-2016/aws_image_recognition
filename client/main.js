angular.module('imageRecognition', []).directive("fileHandler", [function () {
  return {
    restrict: "A",
    scope: {
      fileinput: "=",
      filepreview: "="
    },
    link: function (scope, element, attributes) {
      element.bind("change", function (changeEvent) {
        scope.fileinput = changeEvent.target.files[0];
        var reader = new FileReader();
        reader.onload = function (loadEvent) {
          scope.$apply(function () {
            scope.filepreview = loadEvent.target.result;
          });
        };
        reader.readAsDataURL(scope.fileinput);
      });
    }
  }
}]).controller('MyCtrl', ['$scope', '$location', '$http', function ($scope, $location, $http) {
  $scope.$watch("myFile", function (oldVal, newVal) {
    if (oldVal !== newVal) {
      $scope.showUnMatchMessage = false;
      $scope.isFileMatched = false;
    }
  });

  /**
   * Function to handle http success response.
   * @param response - http response.
   */
  function handleSuccessResponse(response) {
    console.log("success!!");
    $scope.showLoadingIcon = false;
    if (response.data && response.data.matchedFace) {
      $scope.isFileMatched = true;
      $scope.matchedFileSrc = response.data.matchedFace;
    } else {
      $scope.showUnMatchMessage = true;
      $scope.unMatchMessage = response.data;
    }
  }

  /**
   * Function to handle http error response.
   * @param error - http error.
   */
  function handleErrorResponse(error) {
    console.log("error!!");
    $scope.showLoadingIcon = false;
    $scope.showUnMatchMessage = true;
    $scope.unMatchMessage = "Unknown Error occurred while matching the face !!!";
  }

  /**
   * Function to upload a file into server, in order to match a look-alike face.
   */
  $scope.uploadFile = function () {
    $scope.showUnMatchMessage = false;
    $scope.isFileMatched = false;
    $scope.showLoadingIcon = true;

    var file = $scope.myFile;
    var fd = new FormData();
    fd.append('image', file);
    var url = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/api/recognize';

    $http.post(url, fd, {
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined}
    }).then(handleSuccessResponse).catch(handleErrorResponse);
  };
}]);