/*
 * Copyright (c) 2015, Insturcture Inc.
 * Copyright (c) 2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

var { lt, gt, title } = require("./common");

function annotateFunctions(fileCoverage, structuredText) {
    var fnStats = fileCoverage.f,
        fnMeta = fileCoverage.fnMap;
    if (!fnStats) { return; }
    Object.keys(fnStats).forEach(function (fName) {
        var count = fnStats[fName],
            meta = fnMeta[fName],
            type = count > 0 ? 'yes' : 'no',
            startCol = meta.loc.start.column,
            endCol = meta.loc.end.column + 1,
            startLine = meta.loc.start.line,
            endLine = meta.loc.end.line,
            openSpan = lt + 'span class="' + (meta.skip ? 'fstat-skip' : 'fstat-no') + '"' + title('function not covered') + gt,
            closeSpan = lt + '/span' + gt,
            text;

        if (type === 'no') {
            if (endLine !== startLine) {
                endLine = startLine;
                endCol = structuredText[startLine].text.originalLength();
            }
            text = structuredText[startLine].text;
            text.wrap(startCol,
                openSpan,
                startLine === endLine ? endCol : text.originalLength(),
                closeSpan);
        }
    });
}

module.exports = annotateFunctions;