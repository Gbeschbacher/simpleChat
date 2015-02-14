require( "traceur/bin/traceur-runtime" );

var TMP_PATH = "../../build/tmp/";

/* Add classes here */
var toExport = {
    Router: require( TMP_PATH + "router.js" ).default
};


toExport.default = toExport;

module.exports = toExport;
