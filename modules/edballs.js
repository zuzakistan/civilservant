var bot = require( '..' );

bot.addListener( 'message', function ( nick, to, text ) {
	var shadowchancellors = text.match( /ed balls/gi );
	if ( shadowchancellors && shadowchancellors.length !== 0 ) {
		bot.say( to, shadowchancellors[0] );
	}
} );
