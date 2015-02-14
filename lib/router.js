"use strict";
"use strict";
Object.defineProperties(module.exports, {
  default: {get: function() {
      return $__default;
    }},
  __esModule: {value: true}
});
var Router = function Router() {
  this.routes = {
    "": "home",
    "chatroom": "chatroom"
  };
  $traceurRuntime.superConstructor($Router).call(this);
};
var $Router = Router;
($traceurRuntime.createClass)(Router, {
  home: function() {
    console.log("Router#home");
  },
  chatroom: function() {
    console.log("Router#chatroom");
  }
}, {}, Backbone.Router);
var $__default = Router;
