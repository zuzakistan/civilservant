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
		var words = text.split( ' ' );
		words.shift();
		if ( typeof words[0] === 'undefined' ) {
			words = [ 'khan' ];
		}
		var a = bot.config.khan || 434;
		console.log( words );
		a = a / words.length;
		var number = Math.floor(Math.random() * a) + 1;
		words = words.map( function ( current ) {
			return khan.khan( current, number);
		} );
		bot.say( to, words.join( ' ' ) );
	}
} );
