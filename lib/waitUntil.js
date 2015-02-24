module.exports = function(cond, done, pulse, maxTries) {
  var tryIndex = 0;
  var run = function() {
    if (++tryIndex >= maxTries) {
      return done();
    }
    else if (cond()) {
      done();
    }
    else {
      setTimeout(run, pulse);
    }
  };

  run();
}