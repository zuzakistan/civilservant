var bot = require( '..' );
bot.addListener( 'error', function ( message ) {
	console.log( 'ERR: ' + JSON.stringify( message ) );
} );
