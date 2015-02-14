"use strict";

import { User, Chatroom } from './models';

const {Collection} = Backbone;

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
