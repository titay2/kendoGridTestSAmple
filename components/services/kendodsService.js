(function() {
  "use strict";

  var serviceId = "kendoDataSourceService";

  angular.module("app").factory(serviceId, ["$http", kendoDataSourceService]);

  function kendoDataSourceService($http, dataService) {
    return {
      getCarDataSourse: getCarDataSourse(),
      getZoneDataSourse: getZoneDataSourse(),
      getCarsInWorkShiftDs: getCarsInWorkShiftDs()
    };

    function getCarsUrl() {
      return "Cars/CarsDetails";
    }
    function getZonesUrl() {
      return "ZonesAndCars";
    }
    function getCarsInWorkShiftUrl() {
      return "WorkshiftCarGroup/CarsInWorkshift";
    }
    // Using autobind in kendo widgets can cause them to request datasources before angular has loaded all services?
    // Make sure angular has loaded first. Use autobind with caution.

    var carsDs;
    function getCarDataSourse() {
      if (!carsDs) {
        carsDs = new kendo.data.DataSource({
          type: "json",
          serverFiltering: false,
          transport: {
            read: {
              url: root + getCarsUrl(),
              data: { format: "json" },
              dataType: "json"
            }
          },
          pageSize: 20,
          schema: {
            model: {
              id: "vehicleNumber",
              fields: {
                vehicleNumber: { type: "number" },
                operatingCompanyID: { type: "number" },
                dispatchStatus: { type: "number" },
                soonForHireTime: { type: "date" },
                changedStatus: { type: "date" },
                lastUpdate: { type: "date" },
                workShiftStart: { type: "date" },
                workShiftEnd: { type: "date" }
              }
            }
          }
        });
      }

      if (carsDs.data().length == 0) {
        carsDs.read();
      }

      return carsDs;
    }

    var CarsInWoShDs;

    function getCarsInWorkShiftDs() {
      if (!CarsInWoShDs) {
        CarsInWoShDs = new kendo.data.DataSource({
          type: "json",
          serverFiltering: false,
          transport: {
            read: {
              url: root + getCarsInWorkShiftUrl(),
              data: { format: "json" },
              dataType: "json"
            }
          },
          // pageSize: 10,
          schema: {
            model: {
              fields: {
                statusChange: { type: "date" },
                workShiftStart: { type: "date" },
                workShiftEnd: { type: "date" }
              }
            }
          },
          sort: { field: "vehicleNumber", dir: "asc" }
        });
      }
      if (CarsInWoShDs.data().length == 0) {
        CarsInWoShDs.read();
      }
      return CarsInWoShDs;
    }

    var ZoneDs;

    function getZoneDataSourse() {
      if (!ZoneDs) {
        ZoneDs = new kendo.data.DataSource({
          type: "json",
          serverFiltering: false,
          transport: {
            read: {
              url: root + getZonesUrl(),
              data: { format: "json" },
              dataType: "json"
            }
          },
          pageSize: 25,
          schema: {
            model: {
              id: "zoneId",
              fields: {
                zoneId: { type: "number", editable: false, nullable: true },
                zoneName: { type: "string" },
                freeCarsCount: { type: "number" },
                waitTime: { type: "number" },
                carsList: {
                  type: "array"
                }
              }
            }
          }
        });
      }
      if (ZoneDs.data().length == 0) {
        ZoneDs.read();
      }
      return ZoneDs;
    }
  }
})();
