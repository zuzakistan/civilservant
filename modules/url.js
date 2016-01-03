var getUrls = require( 'get-urls' );
module.exports = {
	events: {
		message: function ( bot, nick, to, text, msg ) {
			var urls = getUrls( text );
			if ( urls.length ) {
				bot.fireEvents( 'urls', urls, nick, to, text, msg );
				for ( var i = 0; i < urls.length; i++ ) {
					bot.fireEvents( 'url', urls[i], nick, to, text, msg );
				}
			}
		}
	}
};
