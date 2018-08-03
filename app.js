(function() {
  "use strict";

  angular
    .module("app", [
      "ui.router",
      "ui.bootstrap",
      "daterangepicker",
      "pascalprecht.translate",
      "ngCookies",
      "kendo.directives",
      "ngHello",
      "angular-jwt"
    ])
    .config(config);

  config.$inject = [
    "$stateProvider",
    "$urlRouterProvider",
    "$translateProvider",
    "$locationProvider"
  ];

  function config(
    $stateProvider,
    $urlRouterProvider,
    $translateProvider,
    $locationProvider
  ) {
    // $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix("");
    $translateProvider
      .preferredLanguage("en-GB")
      .fallbackLanguage("en-GB")
      .useStaticFilesLoader({
        prefix: "assets/i18n/local-",
        suffix: ".json"
      })
      .useSanitizeValueStrategy()
      .useCookieStorage();
    $stateProvider
      .state("carsinshift", {
        url: "/carsinshift",
        templateUrl: "components/carsinshift/carsinshift.html",
        controller: "CarShiftCtrl",
        controllerAs: "vm"
      })
      .state("carInfo", {
        url: "/carInfo",
        templateUrl: "components/carInfo/carInfo.html",
        controller: "CarInfoCtrl",
        controllerAs: "vm"
      })

      .state("zone", {
        url: "/zone",
        templateUrl: "components/zone/zone.html",
        controller: "ZoneCtrl",
        controllerAs: "vm"
      });
    $urlRouterProvider.otherwise("/zone");
  }
})();
