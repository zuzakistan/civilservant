var bot = require( '..' );

bot.addListener( 'message', function ( nick, to, text, message ) {
	bot.fireEvents( 'message', nick, to, text, message );
} );

bot.addListener( 'pm', function ( nick, text, message ) {
	bot.fireEvents( 'message', nick, text, message );
} );
