(function() {
  "use strict";

  angular.module("app").factory("translateService", translateService);

  translateService.$inject = ["$translate"];

  function translateService($translate) {
    var service = {
      setLanguage: setLanguage
    };
    return service;

    function setLanguage() {
      $("#lang").on("change", function(e) {
        var valueSelected = this.value;
        if (valueSelected === "fi-FI") {
          $translate.use("fi-FI");
        } else if (valueSelected === "en-GB") {
          $translate.use("en-GB");
        } else {
          $translate.use("sv-SE");
        }
      });
    }
  }
})();
