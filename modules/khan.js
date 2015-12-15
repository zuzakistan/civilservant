/**
 * khan.js
 *
 * !khan
 * Makes the bot say KHAAAAAAAAAAAAN.
 */
var bot = require( '..' );
var khan = require( 'khaan' );

bot.addListener( 'message', function ( nick, to, text ) {
	if ( text.substr( 0, 5 ) === '!khan' ) {
		var args = text.split( ' ' );
		var word = args[1] ? args[1] : 'khan';
		var a = bot.config.khan || 434;
		var number = Math.floor(Math.random() * a) + 1;
		bot.say( to, khan.khan( word, number ) );
	}
} );
