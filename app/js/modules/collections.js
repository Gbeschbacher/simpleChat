"use strict";

class Users extends Collection {
  constructor (args) {
    this.model = User;
    super(args)
  }
}

class Chatrooms extends Collection {
  constructor (args) {
    this.model = Chatroom;
    super(args)
  }
}

export {Users, Chatrooms};
