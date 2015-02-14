(function() {
    "use strict";
    var Router = require("express").Router;

    var router = Router();

    router.all( "*", function(req, res) {
        console.log( "Route not found: ", req.url );
        res.render("index");
    });

    module.exports = router;
})();



