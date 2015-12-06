/**
 * khan.js
 *
 * !khan
 * Makes the bot say KHAAAAAAAAAAAAN.
 */
var bot = require( '..' );

bot.addListener( 'message', function ( nick, to, text ) {
	if ( text.substr( 0, 5 ) === '!khan' ) {
		var a = bot.config.khan || 434;
		var number = Math.floor(Math.random() * a) + 1;
		var A = Array(number).join('A');
		bot.say( to, 'KH' + A + 'N' );
	}
} );
