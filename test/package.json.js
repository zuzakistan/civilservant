var pjson = require( '../package.json' );
var assert = require( 'assert' );
var grep = require( 'simple-grep' );

var deps = pjson.dependencies;
describe( 'package.json', function () {
	it( 'should have no unused dependencies', function () {
		Object.keys( deps ).forEach( function ( dep ) {
			grep( dep, '*.js modules/*.js' , function ( res ) {
				assert.notEqual( res.length, 0 );
			} );
		} );
	} );
} );
