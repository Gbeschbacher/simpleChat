"use strict";

import Classes from "./modules.js";

var Router = Classes.Router;

class Application {
    constructor(){
        new Router();
        Backbone.history.start({pushState: true});
    }
}

$(() => {
    new Application();
});
