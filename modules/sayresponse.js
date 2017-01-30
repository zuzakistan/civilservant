module.exports = {
	events: {
		message: function ( bot, nick, to, text ) {
			if ( text.startsWith( 'say ' ) ) {
				bot.shout( to, text.substring( 4 ) + '!' );
			}
			if ( text.indexOf( 'lojban' ) !== -1 ) {
				bot.shout( to, text.replace( 'lojban', 'loljban' ) );
			}
		}
	}
};
