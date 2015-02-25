/*
 * Copyright (c) 2015, Insturcture Inc.
 * Copyright (c) 2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

function annotateLines(fileCoverage, structuredText) {
    var lineStats = fileCoverage.l;
    if (!lineStats) { return; }
    Object.keys(lineStats).forEach(function (lineNumber) {
        var count = lineStats[lineNumber];
        structuredText[lineNumber].covered = count > 0 ? 'yes' : 'no';
    });
    structuredText.forEach(function (item) {
        if (item.covered === null) {
            item.covered = 'neutral';
        }
    });
}

module.exports = annotateLines;