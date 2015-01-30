//import { HomeView, ChatRoomView } from './views';

class Router extends Backbone.Router {

    constructor () {
        this.routes = {
            "": "home",
            "chatroom": "chatroom"
        };
        super();
    }

    home () {
        console.log("Router#home");
        //var view = new HomeView();
        //$("#app").html(view.render().$el)
    }

    chatroom () {
        console.log("Router#chatroom");
        //var view = new ChatRoomView();
        //$("#app").html(view.render().$el)
    }
}

export default Router;