"use strict";
Object.defineProperties(module.exports, {
  default: {get: function() {
      return $__default;
    }},
  __esModule: {value: true}
});
var $__views__;
"use strict";
var $__0 = ($__views__ = require("./views"), $__views__ && $__views__.__esModule && $__views__ || {default: $__views__}),
    Home = $__0.HomeView,
    Chatroom = $__0.ChatroomView;
var Router = function Router() {
  this.routes = {
    "": "home",
    "chatroom": "chatroom",
    "*actions": "home"
  };
  $traceurRuntime.superConstructor($Router).call(this);
};
var $Router = Router;
($traceurRuntime.createClass)(Router, {
  home: function() {
    console.log("Router#home");
    var view = new Home();
    $("#app").html(view.render().$el);
  },
  chatroom: function() {
    console.log("Router#chatroom");
    var view = new Chatroom();
    $("#app").html(view.render().$el);
  }
}, {}, Backbone.Router);
var $__default = Router;
