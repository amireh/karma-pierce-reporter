/*
 * Copyright (c) 2015, Insturcture Inc.
 * Copyright (c) 2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

var RE_LT = /</g;
var RE_GT = />/g;
var RE_AMP = /&/g;
var RE_lt = /\u0001/g;
var RE_gt = /\u0002/g;

function customEscape(text) {
    text = text.toString();
    return text.replace(RE_AMP, '&amp;')
        .replace(RE_LT, '&lt;')
        .replace(RE_GT, '&gt;')
        .replace(RE_lt, '<')
        .replace(RE_gt, '>');
}

exports.showCode = function (structured) {
  var array = [];

  structured.forEach(function (item) {
    array.push(customEscape(item.text) || '&nbsp;');
  });

  return array.join('\n');
};

exports.showIgnores = function (metrics) {
  var statements = metrics.statements.skipped,
      functions = metrics.functions.skipped,
      branches = metrics.branches.skipped,
      result;

  if (statements === 0 && functions === 0 && branches === 0) {
    return '<span class="ignore-none">none</span>';
  }

  result = [];

  if (statements >0) { result.push(statements === 1 ? '1 statement': statements + ' statements'); }
  if (functions >0) { result.push(functions === 1 ? '1 function' : functions + ' functions'); }
  if (branches >0) { result.push(branches === 1 ? '1 branch' : branches + ' branches'); }

  return result.join(', ');
};

exports.showLines = function (maxLines) {
  var i;
  var array = [];

  for (i = 0; i < maxLines; i += 1) {
    array[i] = i + 1;
  }

  return array.join('\n');
};

exports.showLineExecutionCounts = function (lines, maxLines) {
  var i;
  var lineNumber;
  var array = [];
  var covered;
  var value = '';

  for (i = 0; i < maxLines; i += 1) {
    lineNumber = i + 1;
    value = '&nbsp;';
    covered = 'neutral';

    if (lines.hasOwnProperty(lineNumber)) {
      if (lines[lineNumber] > 0) {
        covered = 'yes';
        value = lines[lineNumber];
      } else {
        covered = 'no';
      }
    }

    array.push('<span class="cline-any cline-' + covered + '">' + value + '</span>');
  }

  return array.join('\n');
};