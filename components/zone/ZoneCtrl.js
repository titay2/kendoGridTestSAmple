(function() {
  angular.module("app").controller("ZoneCtrl", ZoneCtrl);

  ZoneCtrl.$inject = ["translateService"];

  function ZoneCtrl(translateService) {
    translateService.setLanguage();

    var test = setInterval(function() {
      var zgrid = $("#zonesGrid").data("kendoGrid");
      if (zgrid === undefined) {
        clearInterval(test);
      } else {
        zgrid.dataSource.data(zoneDS);
      }
    }, 5000);

    $("#zonesGrid").kendoGrid({
      dataSource: zoneDS,
      columns: [
        {
          field: "zoneId",
          title: "Zone ID",
          width: "80px"
        },
        {
          field: "zoneName",
          title: "Zone Name",
          width: "150px"
        },
        {
          field: "freeCarsCounts",
          title: "Free Cars",
          width: "80px"
        },
        {
          field: "waitTime",
          title: "Wait Time",
          width: "100px"
        },
        {
          title: "Cars List"
        }
      ],
      pageable: true,
      rowTemplate: kendo.template($("#rowTemplate").html()),
      dataBound: function(e) {
        var gridElement = this.element;
        gridElement
          .find(".0")
          .closest("button")
          .css("background", "#30d965");
        gridElement
          .find(".1")
          .closest("button")
          .css("background", "#db40c5");
        gridElement
          .find(".2")
          .closest("button")
          .css("background", "#ff3636");
        gridElement
          .find(".3")
          .closest("button")
          .css("background", "#eef51b");
        gridElement
          .find(".6")
          .closest("button")
          .css("background", "#30d965");
      }
    });
  }
})();
