var { merge } = require("lodash");
var { keys } = Object;

var calculateCoverage = function(info, metricKey) {
  var IS_BRANCH = metricKey === "b";
  var metric = info[metricKey];
  var items = keys(metric);
  var nrItems = IS_BRANCH ? items.length * 2 : items.length;
  var nrCovered = 0;

  items.forEach(function(index) {
    if (IS_BRANCH) {
      if (metric[index][0] > 0) { ++nrCovered; }
      if (metric[index][1] > 0) { ++nrCovered; }
    }
    else {
      if (metric[index] > 0) { ++nrCovered; }
    }
  });


  info[metricKey + "c"] = nrItems;
  info[metricKey + "vc"] = nrCovered;

  if (nrItems > 0) {
    info[metricKey + "v"] = (nrCovered / nrItems) * 100;
  }
  else {
    info[metricKey + "v"] = 100;
  }
};

module.exports = function(payload) {
  var info = merge({}, payload);

  if (info.b && info.f && info.l && info.s) {
    calculateCoverage(info, "b");
    calculateCoverage(info, "f");
    calculateCoverage(info, "l");
    calculateCoverage(info, "s");

    info.v =
      (
        (info.bc > 0 ? info.bv : 0) +
        (info.fc > 0 ? info.fv : 0) +
        (info.lc > 0 ? info.lv : 0) +
        (info.sc > 0 ? info.sv : 0)
      ) /
      (
        (info.bc > 0 ? 1 : 0) +
        (info.fc > 0 ? 1 : 0) +
        (info.lc > 0 ? 1 : 0) +
        (info.sc > 0 ? 1 : 0)
      )
    ;
  }

  return info;
};