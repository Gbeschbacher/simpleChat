(function() {
    "use strict";
    var Router = require("express").Router;

    var router = Router();

    router.all( "*", function(req, res) {
        console.log( "Route not found: ", req.url );
        res.status(404).json({ error: "not found" });
    });

    module.exports = router;
})();



