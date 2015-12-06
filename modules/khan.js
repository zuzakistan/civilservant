/**
 * khan.js
 *
 * !khan
 * Makes the bot say KHAAAAAAAAAAAAN.
 */
var bot = require( '..' );

bot.addListener( 'message', function ( nick, to, text ) {
	if ( text.substr( 0, 5 ) === '!khan' ) {
		var number = Math.floor(Math.random() * 200) + 1;
		var A = Array(number).join('A');
		bot.say( to, 'KH' + A + 'N' );
	}
} );
