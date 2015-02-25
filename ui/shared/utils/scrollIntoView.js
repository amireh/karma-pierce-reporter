// var $ = require("jquery");

module.exports = function(selector, offsetTop) {
  var $el = document.querySelector(selector);

  if ($el) {
    window.scrollTo(0, $el.offsetTop - offsetTop);
  }
};