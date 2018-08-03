(function() {
  "use strict";
  angular.module("app").factory("apiService", apiService);

  apiService.$inject = ["$http", "$q"];
  function apiService($http, $q) {
    var service = {
      get: get,
      post: post
    };

    $http.defaults.headers.common = {
      "Content-Type": "application/json",
      dataType: "json",
      async: "false"
    };

    return service;

    function get(path, config) {
      var defer = $q.defer();
      $http
        .get(root + path, config)

        .then(function(res) {
          defer.resolve(res.data);
        })

        .catch(function(err) {
          defer.reject(err);
        });
      return defer.promise;
    }

    function post(path, body, config) {
      var defer = $q.defer();
      // console.log(body);
      // console.log(config);
      $http
        .post(root + path, body, config)

        .then(function(res) {
          defer.resolve(res.data);
        })

        .catch(function(err) {
          defer.reject(err);
        });
      return defer.promise;
    }
  }
})();
