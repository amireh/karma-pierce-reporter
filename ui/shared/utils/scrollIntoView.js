var $ = require("jquery");

module.exports = function(selector, offsetTop) {
  var $el = $(selector);

  if ($el.length) {
    $(window).scrollTop($el.position().top - offsetTop);
  }
};