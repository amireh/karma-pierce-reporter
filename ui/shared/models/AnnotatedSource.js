var annotateBranches = require("./AnnotatedSource/annotateBranches");
var annotateFunctions = require("./AnnotatedSource/annotateFunctions");
var annotateLines = require("./AnnotatedSource/annotateLines");
var annotateStatements = require("./AnnotatedSource/annotateStatements");
var InsertionText = require('./AnnotatedSource/InsertionText');
var formatters = require("./AnnotatedSource/formatters");

function template(maxLines, structured, fileCoverage) {
  return [
    `<tr>`,

    `<td class="line-count">`,
      formatters.showLines(maxLines),
    `</td>`,

    `<td class="line-coverage">`,
      formatters.showLineExecutionCounts(fileCoverage, maxLines),
    `</td>`,

    `<td class="text">`,
      `<pre>`,
        formatters.showCode(structured),
      `</pre>`,
    `</td>`,

    `</tr>\n`
  ].join('');
}

module.exports = function(fileCoverage) {
  if (!fileCoverage.code || !Array.isArray(fileCoverage.code)) {
    throw new Error("Expected fileCoverage to contain 'code'");
  }

  var buffer = '';
  var write = function(data) {
    buffer += data;
  };

  var sourceText = fileCoverage.code.join('\n') + '\n';
  var code = sourceText.split(/(?:\r?\n)|\r/);
  var count = 0;
  var structured = code.map(function (str) {
    count += 1;

    return {
      line: count,
      covered: null,
      text: new InsertionText(str, true)
    };
  });

  structured.unshift({ line: 0, covered: null, text: new InsertionText("") });

  write('<pre><table class="coverage">\n');

  annotateLines(fileCoverage, structured);

  // console.log(structured);

  // note: order is important, since statements typically result in spanning the
  // whole line and doing branches late causes mismatched tags
  annotateBranches(fileCoverage, structured);

  annotateFunctions(fileCoverage, structured);
  annotateStatements(fileCoverage, structured);

  structured.shift();

  write(template(structured.length, structured, fileCoverage));
  write('</table></pre>\n');

  return buffer;
};