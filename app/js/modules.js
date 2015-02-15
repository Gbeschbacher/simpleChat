require( "traceur/bin/traceur-runtime" );

var TMP_PATH = "./tmp/";

/* Add classes here */
var toExport = {
    Router: require( "../../build/tmp/router.js" ).default,
    Chatrooms: require( "../../build/tmp/collections.js").default
};


toExport.default = toExport;

module.exports = toExport;
