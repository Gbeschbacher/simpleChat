"use strict";

import { User, Chatroom } from './models';

const {Collection} = Backbone;

class Users extends Collection {
  constructor (args) {
    this.model = User;
    this.url ="/api/v0/users"
    super(args)
  }
}

class Chatrooms extends Collection {
  constructor (args) {
    this.model = Chatroom;
    this.url ="/api/v0/rooms"
    super(args)
  }
}

export {Users, Chatrooms};
