var interwikis = require( '../modules/interwikis.json' );
var assert = require( 'assert' );

describe( 'interwikis.json', function () {
	it( 'should have a $1 in every entry', function () {
		Object.keys( interwikis).forEach( function ( iw) {
			assert.notEqual( interwikis[iw].indexOf( '$1' ), -1 );
		} );
	} );
} );
