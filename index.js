require( "traceur/bin/traceur-runtime" );

var TMP_PATH = "./tmp/";

/* Add classes here */
var toExport = {
    Router: require( "./lib/router.js" ).default
};


toExport.default = toExport;

module.exports = toExport;
