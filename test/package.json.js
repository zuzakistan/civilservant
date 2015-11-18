var pjson = require( '../package.json' );
var _ = require( 'underscore' );
var assert = require( 'assert' );
var exec = require( 'child_process' ).exec;
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

	it( 'should credit all contributors', function ( done ) {
		exec( 'git log --pretty=format:"%an <%ae>" | sort -u',
			function ( err, stdout ) {
				var committers = stdout.split( '\n' );
				var authors = pjson.contributors || [];
				authors.push( pjson.author || null);

				var diff = _.difference( committers, authors );

				// comes with ''
				assert.equal( diff.length, 1 );
				done();
			}
		);
	} );
} );
