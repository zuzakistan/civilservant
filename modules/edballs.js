/**
 * edballs.js
 *
 * Echoes every time someone says "Ed Balls", conserving casing.
 *
 */
var bot = require( '..' );

// https://twitter.com/edballsmp/status/63623585020915713
bot.addListener( 'message', function ( nick, to, text ) {
	var shadowchancellors = text.match( /ed balls/gi );
	if ( shadowchancellors && shadowchancellors.length !== 0 ) {
		bot.say( to, shadowchancellors[0] );
	}
} );
