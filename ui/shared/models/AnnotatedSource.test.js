var subject = require("./AnnotatedSource");
var fmt = function(o, whitespace) { return JSON.stringify(o, undefined, whitespace); };
var { pluck } = require("lodash");
var fixture = {"path":"/home/kandie/Workspace/Projects/get_smart/jsapp/shared/AppDispatcher.js","s":{"1":1,"2":1,"3":1,"4":1,"5":1,"6":0,"7":0,"8":1,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":1},"b":{"1":[0,0]},"f":{"1":1,"2":0,"3":0,"4":0},"fnMap":{"1":{"name":"(anonymous_1)","line":1,"loc":{"start":{"line":1,"column":22},"end":{"line":1,"column":33}}},"2":{"name":"(anonymous_2)","line":6,"loc":{"start":{"line":6,"column":19},"end":{"line":6,"column":37}}},"3":{"name":"(anonymous_3)","line":12,"loc":{"start":{"line":12,"column":21},"end":{"line":12,"column":39}}},"4":{"name":"(anonymous_4)","line":21,"loc":{"start":{"line":21,"column":19},"end":{"line":21,"column":37}}}},"statementMap":{"1":{"start":{"line":1,"column":21},"end":{"line":32,"column":14}},"2":{"start":{"line":2,"column":0},"end":{"line":2,"column":56}},"3":{"start":{"line":3,"column":0},"end":{"line":3,"column":101}},"4":{"start":{"line":4,"column":0},"end":{"line":4,"column":48}},"5":{"start":{"line":6,"column":0},"end":{"line":9,"column":2}},"6":{"start":{"line":7,"column":2},"end":{"line":8,"column":59}},"7":{"start":{"line":8,"column":4},"end":{"line":8,"column":59}},"8":{"start":{"line":11,"column":0},"end":{"line":29,"column":3}},"9":{"start":{"line":13,"column":4},"end":{"line":13,"column":25}},"10":{"start":{"line":14,"column":4},"end":{"line":17,"column":6}},"11":{"start":{"line":18,"column":4},"end":{"line":18,"column":27}},"12":{"start":{"line":22,"column":4},"end":{"line":22,"column":25}},"13":{"start":{"line":23,"column":4},"end":{"line":26,"column":6}},"14":{"start":{"line":27,"column":4},"end":{"line":27,"column":27}},"15":{"start":{"line":31,"column":0},"end":{"line":31,"column":31}}},"branchMap":{"1":{"line":7,"type":"if","locations":[{"start":{"line":7,"column":2},"end":{"line":7,"column":2}},{"start":{"line":7,"column":2},"end":{"line":7,"column":2}}]}},"code":["/** @jsx React.DOM */(function() {","var $__0=    require('flux'),Dispatcher=$__0.Dispatcher;","var $__1=     require('./constants'),PayloadSources=$__1.PayloadSources,ActionTypes=$__1.ActionTypes;","var assign = require(\"react/lib/Object.assign\");","","var validateType = function(action)  {","  if (!ActionTypes[action.type])","    throw new Error(\"Tried to dispatch an unknown action\");","};","","var AppDispatcher = assign(new Dispatcher(), {","  handleServerAction:function (action) {","    validateType(action);","    var payload = {","      source: PayloadSources.SERVER_ACTION,","      action: action","    };","    this.dispatch(payload);","  },","","  handleViewAction:function (action) {","    validateType(action);","    var payload = {","      source: PayloadSources.VIEW_ACTION,","      action: action","    };","    this.dispatch(payload);","  }","});","","module.exports = AppDispatcher;","}.call(this));"],"l":{"1":1,"2":1,"3":1,"4":1,"6":1,"7":0,"8":0,"11":1,"13":0,"14":0,"18":0,"22":0,"23":0,"27":0,"31":1}};

describe.only("models/AnnotatedSource", function() {
  it("should work", function() {
    console.log(fixture.code);
    var output = subject(fixture);
    console.log(output);
  });
});