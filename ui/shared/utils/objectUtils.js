/**
 * merges multiple summary metrics objects by summing up the `totals` and
 * `covered` fields and recomputing the percentages. This function is generic
 * and can accept any number of arguments.
 *
 * @method mergeSummaryObjects
 * @static
 * @param {Object} summary... multiple summary metrics objects
 * @return {Object} the merged summary metrics
 */
function mergeSummaryObjects() {
    var ret = blankSummary(),
        args = Array.prototype.slice.call(arguments),
        keys = ['lines', 'statements', 'branches', 'functions'],
        increment = function (obj) {
            if (obj) {
                keys.forEach(function (key) {
                    ret[key].total += obj[key].total;
                    ret[key].covered += obj[key].covered;
                    ret[key].skipped += obj[key].skipped;
                });
            }
        };
    args.forEach(function (arg) {
        increment(arg);
    });
    keys.forEach(function (key) {
        ret[key].pct = percent(ret[key].covered, ret[key].total);
    });

    return ret;
}

exports.mergeSummaryObjects = mergeSummaryObjects;