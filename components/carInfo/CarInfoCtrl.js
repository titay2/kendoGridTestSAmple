(function() {
  "use strict";

  angular.module("app").controller("CarInfoCtrl", CarInfoCtrl);
  function CarInfoCtrl(translateService, $scope) {
    translateService.setLanguage();

    function start() {
      var add = setInterval(function() {
        var cgrid = $("#myCarsInfoGrid").data("kendoGrid");
        // var state = cgrid.closest("[ui-view]").data("$uiView").state;
        if (cgrid === undefined) {
          clearInterval(add);
        } else {
          cgrid.setDataSource(allcars);
        }
      }, 5000);
    }
    start();

    $("#myCarsInfoGrid").kendoGrid({
      dataSource: allcars,
      groupable: true,
      columns: [
        {
          field: "carNumber",
          title: "Car Number",
          attributes: { class: "driverCardNr" }
        },
        {
          field: "operatingCompanyId",
          hidden: true
        },
        {
          field: "carDispatchAttributes",
          hidden: true,
          title: "Property"
        },
        {
          field: "postingId",
          hidden: true
        },
        { field: "driverId", title: "Driver ID" },
        { field: "zoneId", title: "Zone ID" },
        {
          field: "textMessageStatus",
          title: "TXM Status",
          attributes: { class: "taxiCarCompanyId2" }
        },
        { field: "dispatchStatus", title: "Dispatch Status" },
        {
          field: "soonForHireTime",
          title: "SFH time",
          format: "{0: dd/MM/yyyy  h:mm}"
        },
        {
          field: "soonForHireZone",
          title: "SFH Zone",
          attributes: { class: "taxiCarCompanyId" }
        },
        {
          field: "changedStatus",
          title: "changed Status",
          format: "{0: dd/MM/yyyy  h:mm}"
        },
        {
          field: "lastUpdate",
          title: "Last Update",
          format: "{0: dd/MM/yyyy  h:mm}"
        },
        {
          field: "workShiftStart",
          title: "Workshift Start",
          format: "{0: dd/MM/yyyy  h:mm}"
        },
        {
          field: "workShiftEnd",
          title: "Workshift end",
          format: "{0: dd/MM/yyyy  h:mm}"
        },
        {
          field: "group",
          title: "Group",
          format: "{0: dd/MM/yyyy  h:mm}"
        }
      ],
      filterable: true,
      resizable: true,
      sortable: true,
      pageable: true
    });
    // }

    watchAndFilter("callCenterId", "operatingCompanyID");
    watchAndFilter("vehicleFilter", "carNumber");
    watchAndFilter("areaFilter", "postingID");
    watchAndFilter("propertyFilter", "carDispatchAttributes");

    //WATCH CHANGES ON THE LOCALSTORAGE FILTER VALUES AND PASS THE NEW VALUES TO TE FILTER FUNCTION
    function watchAndFilter(watchThis, filterBy) {
      var gridData = $("#myCarsInfoGrid").data("kendoGrid");
      function getValue() {
        return window.localStorage.getItem(watchThis);
      }

      $scope.$watch(getValue, function(val) {
        if (val) {
          var newValue = $.parseJSON(val);
          applyFilter(filterBy, newValue, gridData, allcars);
        }
      });
    }
  }
})();
