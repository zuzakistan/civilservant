/**
 * edballs.js
 *
 * Echoes every time someone says "Ed Balls", conserving casing.
 *
 */
var bot = require( '..' );

// https://twitter.com/edballsmp/status/63623585020915713
bot.addListener( 'message', function ( nick, to, text ) {
	var privycouncillors = text.match( /ed balls/gi );
	if ( privycouncillors && privycouncillors.length !== 0 ) {
		bot.say( to, privycouncillors[0] );
	}
} );
