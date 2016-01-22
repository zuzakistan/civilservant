var Bitly = require( 'bitly' );
module.exports = {
	events: {
		url: function ( bot, url, nick, to ) {
			var bitly = new Bitly( bot.config.bitly.username, bot.config.bitly.password );
			bitly.shorten( url.href, function ( err, res ) {
				if ( err ) {
					return; // fail silently (usually duplicate URL)
				}
				if ( res.data.url && res.data.url.length < url.href.length ) {
					bot.shout( to, res.data.url );
				}
			} );
		}
	},
	commands: {
		shorten: {
			help: 'Shorten a URL',
			usage: [ 'url' ],
			command: function ( bot, msg ) {
				var bitly = new Bitly( bot.config.bitly.username, bot.config.bitly.password );
				bitly.shorten( msg.args.url, function ( err, res ) {
					if ( err ) {
						bot.say( msg.to, 'Unable to shorten that.' );
					}
					if ( res.data.url ) {
						bot.say( msg.to, res.data.url );
					}
				} );
			}
		}
	}
};
