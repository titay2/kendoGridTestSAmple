var root = "https://semasp04.semel.fi/TestCarsurveillanceBackend/api/";
var fleet = $.connection.dispatchStatusTickerHub;
var zoneAndCarHub = $.connection.universalCarsTickerHub;
$.connection.hub.start();
$.connection.hub.url = "http://testcarsurveillanceworker.semel.fi:8080/signalr";

var filters = {
  operatingCompanyID: "",
  postingID: "",
  carNumber: "",
  carAndDriverAttributes: ""
};
var testArray = [];
findCallCenter();
findArea();

filterEvents("#inputCenter", "callCenterId");
filterEvents("#inputArea", "areaFilter");
filterEvents("#vihecle", "vehicleFilter");
filterEvents("#propertyInput", "propertyFilter");
$("#clearLable").click(function() {
  clearevtg();
});
//CONNECT TO THE SIGNAR, LOAD THE FIRST INPUTS FROM THE API, GET CHANGES FROM SIGNALR AND UPDATE UI.
var allFleetStatus = new kendo.data.DataSource({
  transport: {
    read: {
      url: root + "FleetStates/dispatchInfo",
      dataType: "json"
    }
  },
  schema: {
    model: {
      id: "carNumber"
    }
  }
});
allFleetStatus.read();
fleet.client.dispatchStatusUpdate = function(update_array) {
  for (var j = 0; j < update_array.length; j++) {
    var fleetStatus = allFleetStatus.get(update_array[j].carNumber);
    if (!fleetStatus) {
      allFleetStatus.add(update_array[j]);
    } else {
      fleetStatus.set("postingId", update_array[j].postingId);
      fleetStatus.set("dispatchStatus", update_array[j].dispatchStatus);
      fleetStatus.set("operatingCompanyId", update_array[j].operatingCompanyId);
      fleetStatus.set(
        "carAndDriverAttributes",
        update_array[j].carAndDriverAttributes
      );
    }
  }

  var result = getfilteredzones(allFleetStatus._data);
  updateStatus(result, 0, "freecars");
  updateStatus(result, 1, "soonfh");
  updateStatus(result, 2, "occupied");
  updateStatus(result, 3, "notavailable");
};
var allcars = new kendo.data.DataSource({
  transport: {
    read: {
      url: root + "Cars/UniversalCars",
      dataType: "json"
    }
  },
  pageSize: 20,
  schema: {
    model: {
      id: "carNumber",
      fields: {
        soonForHireTime: { type: "date" },
        changedStatus: { type: "date" },
        lastUpdate: { type: "date" },
        workShiftStart: { type: "date" },
        workShiftEnd: { type: "date" }
      }
    }
  },
  sort: { field: "carNumber", dir: "asc" }
});
var zoneDS;
allcars.read();

zoneAndCarHub.client.universalCarsUpdate = function(zonesAndCarsUpdate) {
  for (var i = 0; i < zonesAndCarsUpdate.length; i++) {
    var zoneAndCars = allcars.get(zonesAndCarsUpdate[i].carNumber);
    if (!zoneAndCars) {
      allcars.add(zonesAndCarsUpdate[i]);
    } else {
      zoneAndCars.set("zoneId", zonesAndCarsUpdate[i].zoneId);
      zoneAndCars.set(
        "dispatchStatusId",
        zonesAndCarsUpdate[i].dispatchStatusId
      );
      zoneAndCars.set("carString", zonesAndCarsUpdate[i].carString);
      zoneAndCars.set("statusTime", zonesAndCarsUpdate[i].statusTime);
    }
  }

  var zoneNumberList = extractZones(allcars._data);
  zoneDS = modifyZoneDs(allcars._data, zoneNumberList);
  if (testArray.length === 0) {
    allcars.filter({});
  }
};
function updateStatus(data, num, id) {
  var count;
  document.getElementById(id).innerHTML = 0;
  for (var i in data) {
    if (data.hasOwnProperty(i)) {
      if (data[i].dispatchStatus === num) {
        count = data.reduce(function(n, status) {
          return n + (status.dispatchStatus == num);
        }, 0);
        document.getElementById(id).innerHTML = count;
      } else {
      }
    }
  }
}

function filterEvents(id, storage) {
  $(id).on("input", function() {
    var opt = $('option[value="' + $(this).val() + '"]');
    var val = opt.attr("id");

    if (val) {
      if ($.isNumeric(val)) {
        setFiletr(storage, val);
        if (id === "#inputCenter") {
          filters.operatingCompanyID = parseInt(val);
          testArray.push(val);
        }
        if (id === "#inputArea") {
          filters.postingID = parseInt(val);
          testArray.push(val);
        }
      }
    } else {
      var filter = $(this).val();
      setFiletr(storage, filter);
      if (id === "#vihecle") {
        filters.carNumber = parseInt(filter);
        testArray.push(filter);
      }
      if (id === "#propertyInput") {
        filters.carAndDriverAttributes = filter;
        testArray.push(filter);
      }
    }
  });
}
function findCallCenter() {
  $.ajax({
    url: root + "OperatingCompanies",
    method: "GET",
    dataType: "json",
    success: function(data) {
      $(data).each(function() {
        var callCenter =
          '<option id= "' +
          this.operatingCompanyId +
          '"  value="' +
          this.name +
          '">' +
          this.name +
          "</option>";
        $("#inputCenter").append(callCenter);
      });
    },
    error: function(textStatus, errorThrown) {
      alert("error: " + textStatus + ": " + errorThrown);
    }
  });
}
function findArea() {
  $.ajax({
    url: root + "Postings",
    method: "GET",
    dataType: "json",
    success: function(data) {
      $(data).each(function() {
        var postingArea =
          '<option id= "' +
          this.postingId +
          '" value="' +
          this.postingName +
          '">' +
          this.postingName +
          "</option>";
        $("#inputArea").append(postingArea);
      });
    },
    error: function(textStatus, errorThrown) {
      alert("error: " + textStatus + ": " + errorThrown);
    }
  });
}
function updateStatus(data, num, id) {
  var count;
  document.getElementById(id).innerHTML = 0;
  for (var i in data) {
    if (data.hasOwnProperty(i)) {
      if (data[i].dispatchStatus === num) {
        count = data.reduce(function(n, status) {
          return n + (status.dispatchStatus == num);
        }, 0);
        document.getElementById(id).innerHTML = count;
      } else {
      }
    }
  }
}

//POPULATE THE CALLCENTER INPUT OPTIONS WITH DATA FROM DATABASE

function clearevtg() {
  localStorage.removeItem("callCenterId");
  localStorage.removeItem("areaFilter");
  localStorage.removeItem("propertyFilter");
  localStorage.removeItem("vehicleFilter");
  filters = {
    operatingCompanyID: "",
    postingID: "",
    carNumber: "",
    carAndDriverAttributes: ""
  };
  $("#inputCenter").val("");
  $("#inputArea").val("");
  $("#propertyInput").val("");
  $("#vihecle").val("");
  testArray = [];
}

//SETS DATA TO LOCALSTORAGE
function setFiletr(storageField, inputValue) {
  localStorage.setItem(storageField, JSON.stringify(inputValue));
}
//Filter data from signalR with the values from the top navbar filters
function getfilteredzones(allFleets) {
  var resultposting;
  if (filters.operatingCompanyID) {
    resultposting = allFleets.filter(function(o) {
      return o.operatingCompanyId === filters.operatingCompanyID;
    });
  } else {
    resultposting = allFleets;
  }

  if (filters.carNumber) {
    resultposting = resultposting.filter(function(o) {
      return o.carNumber === filters.carNumber;
    });
  }
  if (filters.carAndDriverAttributes) {
    resultposting = resultposting.filter(function(o) {
      if (o.carAndDriverAttributes !== null) {
        return (
          // o.carAndDriverAttributes.indexOf(filters.carAndDriverAttributes) >
          // -1
          o.carAndDriverAttributes === filters.carAndDriverAttributes
        );
      }
    });
  }
  if (filters.postingID) {
    resultposting = resultposting.filter(function(o) {
      return o.postingId === filters.postingID;
    });
  }
  return resultposting;
}

//TAKE FILTER VALUES FROM LOCALSTORAGE AND MODIFIES THE DATASOURCE ACCORDINGLY
function applyFilter(filterField, filterValue, grid) {
  var currFilterObj = grid.dataSource.filter();
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
    if (filterField === "carDispatchAttributes") {
      currentFilters.push({
        field: filterField,
        operator: "contains",
        value: filterValue
      });
    } else {
      currentFilters.push({
        field: filterField,
        operator: "eq",
        value: filterValue
      });
    }
  }
  grid.dataSource.filter({
    logic: "and",
    filters: currentFilters
  });
}
function extractZones(allCars) {
  var zoneNumList = _.uniq(allCars, function(item) {
    return item.zoneId;
  });
  allZones = zoneNumList.map(a => a.zoneId);
  return allZones;
}
function desc_start_time(a, b) {
  return new Date(a.statusTime).getTime() - new Date(b.statusTime).getTime();
}

function modifyZoneDs(carsDs, zonesList) {
  var zonesList = _.sortBy(zonesList, function(num) {
    return num;
  });
  var ZoneInfoDs = [];
  for (var k = 0; k < zonesList.length; k++) {
    var gridRow = _.where(carsDs, {
      zoneId: zonesList[k]
    });
    var odds = _.reject(gridRow, function(num) {
      if (num.dispatchStatusId == 5 && num.m2mgwStatus == 1) {
        return num;
      }
    });

    if (odds.length > 0) {
      var b = _
        .chain(odds)
        .sort(desc_start_time)
        .value();

      var filteredZones = getfilteredzones(b);
      var freeCarCount = filteredZones.reduce(function(n, status) {
        return n + (status.dispatchStatusId == 0);
      }, 0);

      var slicedfilteredZones = filteredZones.slice(0, 25);
      if (slicedfilteredZones.length > 0) {
        var d = new Date();
        var utcOffset = moment(d).utcOffset();
        var c = slicedfilteredZones[0].statusTime;
        var waittimeLocal = moment().diff(c, "minutes");
        var waittime = waittimeLocal - utcOffset;
        var obj = {};
        obj.zoneId = slicedfilteredZones[0].zoneId;
        obj.zoneName = slicedfilteredZones[0].zoneName;
        obj.freeCarsCount = freeCarCount;
        obj.waitTime = waittime;
        obj.carsList = slicedfilteredZones;
        ZoneInfoDs.push(obj);
      }
    }
  }
  return ZoneInfoDs;
}
