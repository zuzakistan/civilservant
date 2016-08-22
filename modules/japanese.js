/**
 * The original intention of this module was to translate
 * using the Google Translate API, but it's a paid service.
 * Hence, this pale imitation.
 */
var jp = require( 'japanese' );

module.exports = {
	events: {
		message: function ( bot, nick, to, text ) {
			// http://stackoverflow.com/a/15034560/1875784
			if ( text.match( /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/ ) ) {
				var romaji = jp.romanize( text );
				if ( romaji.trim() ) {
					bot.shout( to, '\u000314' + romaji );
				}
			}
		}
	}
};

