/*
 * Copyright (c) 2015, Insturcture Inc.
 * Copyright (c) 2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

var { lt, gt, title } = require("./common");

function annotateBranches(fileCoverage, structuredText) {
    var branchStats = fileCoverage.b,
        branchMeta = fileCoverage.branchMap;
    if (!branchStats) { return; }

    Object.keys(branchStats).forEach(function (branchName) {
        var branchArray = branchStats[branchName],
            sumCount = branchArray.reduce(function (p, n) { return p + n; }, 0),
            metaArray = branchMeta[branchName].locations,
            i,
            count,
            meta,
            type,
            startCol,
            endCol,
            startLine,
            endLine,
            openSpan,
            closeSpan,
            text;

        if (sumCount > 0) { //only highlight if partial branches are missing
            for (i = 0; i < branchArray.length; i += 1) {
                count = branchArray[i];
                meta = metaArray[i];
                type = count > 0 ? 'yes' : 'no';
                startCol = meta.start.column;
                endCol = meta.end.column + 1;
                startLine = meta.start.line;
                endLine = meta.end.line;
                openSpan = lt + 'span class="branch-' + i + ' ' + (meta.skip ? 'cbranch-skip' : 'cbranch-no') + '"' + title('branch not covered') + gt;
                closeSpan = lt + '/span' + gt;

                if (count === 0) { //skip branches taken
                    if (endLine !== startLine) {
                        endLine = startLine;
                        endCol = structuredText[startLine].text.originalLength();
                    }
                    text = structuredText[startLine].text;
                    if (branchMeta[branchName].type === 'if') { // and 'if' is a special case since the else branch might not be visible, being non-existent
                        text.insertAt(startCol, lt + 'span class="' + (meta.skip ? 'skip-if-branch' : 'missing-if-branch') + '"' +
                            title((i === 0 ? 'if' : 'else') + ' path not taken') + gt +
                            (i === 0 ? 'I' : 'E')  + lt + '/span' + gt, true, false);
                    } else {
                        text.wrap(startCol,
                            openSpan,
                            startLine === endLine ? endCol : text.originalLength(),
                            closeSpan);
                    }
                }
            }
        }
    });
}

module.exports = annotateBranches;