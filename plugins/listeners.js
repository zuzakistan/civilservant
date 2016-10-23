var bot = require( '..' );

bot.addListener( 'message', function ( nick, to, text, message ) {
	bot.fireEvents( 'message', nick, to, text, message );
} );

bot.addListener( 'pm', function ( nick, text, message ) {
	bot.fireEvents( 'message', nick, text, message );
} );

bot.addListener( 'ctcp-version', function ( from, to, message ) {
	bot.fireEvents( 'version', from, to, message );
} );

bot.addListener( 'action', function ( from, to, text, message ) {
	bot.fireEvents( 'action', from, to, text, message );
} );
