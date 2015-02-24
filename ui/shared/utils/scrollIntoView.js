var $ = require("jquery");

module.exports = function(selector) {
  var $el = $(selector);

  if ($el.length) {
    $(window).scrollTop($el.position().top);
  }
};