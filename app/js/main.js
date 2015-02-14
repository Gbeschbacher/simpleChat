"use strict";

import Classes from "./classes.js";

var Router = Classes.Router;

class Application {
    constructor(){
        new Router();
        Backbone.history.start();
    }
}

$(() => {
    new Application();
});
