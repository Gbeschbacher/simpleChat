"use strict";
Object.defineProperties(module.exports, {
  HomeView: {get: function() {
      return HomeView;
    }},
  ChatroomView: {get: function() {
      return ChatroomView;
    }},
  __esModule: {value: true}
});
var $__1 = Backbone,
    View = $__1.View,
    Model = $__1.Model,
    Collection = $__1.Collection;
var ENTER_KEY = 13;
var HomeView = function HomeView() {
  $traceurRuntime.superConstructor($HomeView).apply(this, arguments);
};
var $HomeView = HomeView;
($traceurRuntime.createClass)(HomeView, {
  initialize: function() {
    this.template = $('script[name="home"]').html();
    console.log("homeview init");
    this.events = {
      'click button#username': 'createUser',
      'click button#chatroom': 'createChatroom',
      'keyup input[name="username"]': 'keyPressEventHandler'
    };
    this.Chatrooms = new Chatrooms;
    this.Users = new Users;
    console.log(JSON.stringify(new User()));
    console.log(JSON.stringify(new User({name: "test"})));
  },
  render: function() {
    this.$el.html(_.template(this.template));
    return this;
  },
  createUser: function(e) {
    event.preventDefault();
    var $userName = this.$el.find('input[name="username"]');
    var user = new User({name: $userName.val()});
    this.Users.add(user);
    console.log(this.Users);
  },
  createChatroom: function(e) {
    event.preventDefault();
    var $chatroom = this.$el.find('input[name="chatroom"]');
    var chatroom = new Chatroom({name: $chatroom.val()});
    this.Chatrooms.add(chatroom);
    console.log(this.Chatrooms);
  },
  keyPressEventHandler: function(event) {
    if (event.keyCode === ENTER_KEY) {}
  }
}, {}, View);
var ChatroomView = function ChatroomView() {
  $traceurRuntime.superConstructor($ChatroomView).apply(this, arguments);
};
var $ChatroomView = ChatroomView;
($traceurRuntime.createClass)(ChatroomView, {
  initialize: function() {
    this.template = $('script[name="chatroom"]').html();
    this.events = {
      'click button[type="submit"]': 'sendMessage',
      'keyup input[type="text"]': 'keyPressEventHandler'
    };
  },
  render: function() {
    console.log($('script[name="chatroom"]').html());
    this.$el.html(_.template(this.template));
    return this;
  },
  sendMessage: function(event) {
    console.log("sendMessage in ChatroomView");
    event.preventDefault();
    var $message = this.$el.find('input[type="text"]');
    var message = $message.val();
    $message.val('');
    console.log("message in ChatroomView: " + message);
  },
  keyPressEventHandler: function(event) {
    if (event.keyCode === ENTER_KEY) {
      this.sendMessage(event);
    }
  }
}, {}, View);
var Socket = function Socket() {
  this.socket = io();
  return this.socket;
};
($traceurRuntime.createClass)(Socket, {}, {});
var User = function User(args) {
  $traceurRuntime.superConstructor($User).call(this, args);
  Object.defineProperty(this, "name", {
    get: function() {
      return this.get("name");
    },
    set: function(value) {
      this.set("name", value);
    }
  });
};
var $User = User;
($traceurRuntime.createClass)(User, {defaults: function() {
    return {name: "unnamed"};
  }}, {}, Model);
var Users = function Users(args) {
  this.model = User;
  $traceurRuntime.superConstructor($Users).call(this, args);
};
var $Users = Users;
($traceurRuntime.createClass)(Users, {}, {}, Collection);
var Chatroom = function Chatroom(args) {
  $traceurRuntime.superConstructor($Chatroom).call(this, args);
  Object.defineProperty(this, "name", {
    get: function() {
      return this.get("name");
    },
    set: function(value) {
      this.set("name", value);
    }
  });
  Object.defineProperty(this, "users", {
    get: function() {
      return this.get("users");
    },
    set: function(value) {
      this.set("users", value);
    }
  });
};
var $Chatroom = Chatroom;
($traceurRuntime.createClass)(Chatroom, {defaults: function() {
    return {name: "unnamed"};
  }}, {}, Model);
var Chatrooms = function Chatrooms(args) {
  this.model = Chatroom;
  $traceurRuntime.superConstructor($Chatrooms).call(this, args);
};
var $Chatrooms = Chatrooms;
($traceurRuntime.createClass)(Chatrooms, {}, {}, Collection);
;
