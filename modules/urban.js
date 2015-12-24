/**
 * iss.js
 *
 * !ud [headword]
 * Looks up a definition in Urban Dictionary.
 */
var bot = require( '..' );
var urban = require( 'urban' );
bot.addListener( 'message', function ( nick, to, text ) {
	if ( ( text.substr( 0, 6 ) === '!urban' ) || ( text.substr( 0, 3 ) === '!ud' ) ) {
		var args = text.split( ' ' );
		if ( args.length === 1 ) {
			bot.say( to, nick + ': Usage: !urban <headword>' );
			return;
		}
		args.shift();
		var req = urban(args.join(' ') );
		req.first( function ( data ) {
			if ( typeof data === 'undefined' ) {
				bot.say( to, nick + ': unable to find a definition for ' + args.join( ' ' ) );
			} else {
				bot.say( to, nick + ': ' + data.definition /* + ' ' + data.permalink */ );
			}
		} );
	}
} );

