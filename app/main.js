(function() {
    "use strict";

    import Router from './router';

    class Application {
        constructor(){
            new Router();
            Backbone.history.start();
        }
    }

    /*
    $(() => {
        new Application();
    });*/
})();
