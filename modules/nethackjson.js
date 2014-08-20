var web = require( './webserver' );
var nao = require( 'nao-parse' );
web.get( '/nethack/:user.json', function ( req, res ) {
	nao( req.params.user, function( games ) {
		res.json( games );
	} );
} );

