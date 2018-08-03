(function() {
  "use strict";
  angular.module("app").service("filterService", filterService);
  //filterService.$inject = ["$scope"];
  function filterService($rootScope) {
    return {
      watchAndFilter: function(watchThis, filterBy, id) {
        function getValue() {
          return window.localStorage.getItem(watchThis);
        }
        $rootScope.$watch(getValue, function(val) {
          if (val) {
            var newValue = $.parseJSON(val);
            applyFilter(filterBy, newValue);
          }
        });
      }
    };

    function applyFilter(filterField, filterValue, id) {
      var gridData = $("#grid").data("kendoGrid");
      var currFilterObj = gridData.dataSource.filter();
      var currentFilters = currFilterObj ? currFilterObj.filters : [];

      if (currentFilters && currentFilters.length > 0) {
        for (var i = 0; i < currentFilters.length; i++) {
          if (currentFilters[i].field == filterField) {
            currentFilters.splice(i, 1);
            break;
          }
        }
      }

      if (filterValue != "0") {
        currentFilters.push({
          field: filterField,
          operator: "eq",
          value: filterValue
        });
      }

      dataSource.filter({
        logic: "and",
        filters: currentFilters
      });
    }
  }
})();
