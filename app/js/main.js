"use strict";

import Classes from "./modules.js";

var Router = Classes.Router;
var Chatrooms = Classes.Chatrooms;

class Application {
    constructor(){
        this.router = new Router();
        Backbone.history.start();
    }
}

$(() => {
    window.url = window.location.protocol + "//"+ window.location.host;
    window.rooms = new Chatrooms();
    window.app = new Application();
});
