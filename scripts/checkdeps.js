var pjson = require( '../package.json' );
var grep = require( 'simple-grep' );

var deps = pjson.dependencies;
Object.keys( deps ).forEach( function ( dep ) {
	grep( dep, '*.js modules/*.js' , function ( res ) {
		if ( res.length === 0 ) {
			console.log( dep + ' is an unused dependency!' );
			process.exit( 1 );
		}
	} );
} );
