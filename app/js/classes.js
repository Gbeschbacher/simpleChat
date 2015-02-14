require( "traceur/bin/traceur-runtime" );

var TMP_PATH = "../../build/tmp/";
/* Add classes here */
var toExport = {
    Router: require( TMP_PATH + "router.js" ).default
};

module.exports = toExport.default = toExport;
