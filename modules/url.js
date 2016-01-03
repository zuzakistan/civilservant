var getUrls = require( 'get-urls' );
var parseurl = require( 'url' );
module.exports = {
	events: {
		message: function ( bot, nick, to, text, msg ) {
			var urls = getUrls( text );
			if ( urls.length ) {
				bot.fireEvents( 'urls', urls, nick, to, text, msg );
				for ( var i = 0; i < urls.length; i++ ) {
					var curr = parseurl.parse( urls[i] );
					bot.fireEvents( 'url', curr, nick, to, text, msg );
					bot.fireEvents( 'url:' + curr.hostname, curr, nick, to, text, msg );
				}
			}
		}
	}
};
