var bot = require( '..' );
bot.addListener( 'error', function ( message ) {
	console.log('ERR: ' + message);
} );
