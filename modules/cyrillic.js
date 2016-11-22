var convert= require( 'cyrillic-to-latin' );

module.exports = {
	events: {
		message: function ( bot, nick, to, text ) {
			if ( text.match( /[а-я]+/i ) ) {
				var roman = convert( text );
				if ( roman.trim() ) {
					bot.shout( to, '\u000314' + roman );
				}
			}
		}
	}
};

