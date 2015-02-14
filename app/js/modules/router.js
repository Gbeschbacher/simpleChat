"use strict";

import { HomeView as Home, ChatroomView as Chatroom } from './views';

class Router extends Backbone.Router {

    constructor () {
        this.routes = {
            "": "home",
            "chatroom": "chatroom",
            "*actions": "home"
        };
        super();
    }

    home () {
        console.log("Router#home");
        var view = new Home();
        $("#app").html(view.render().$el)
        this.testIs = true;
    }

    chatroom () {
        console.log("Router#chatroom");
        var view = new Chatroom();
        $("#app").html(view.render().$el)
    }
}

export default Router;
