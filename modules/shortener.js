var Bitly = require( 'bitly' );
module.exports = {
	events: {
		url: function ( bot, url, nick, to ) {
			var bitly = new Bitly( bot.config.bitly.username, bot.config.bitly.password );
			bitly.shorten( url.href, function ( err, res ) {
				if ( err ) {
					return; // fail silently (usually duplicate URL)
				}
				if ( res.data.url && res.data.url.length < url.href.length) {
					bot.shout( to, res.data.url );
				}
			} );
		}
	}
};
