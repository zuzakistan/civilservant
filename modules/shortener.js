var Bitly = require( 'bitly' );
var fs = require( 'fs' );
var LOG = {};

var LOGFILE = __rootdir + '/data/ofn.json';
try {
	LOG = require( LOGFILE );
} catch ( e ) {
	//
}
module.exports = {
	events: {
		url: function ( bot, url, nick, to ) {
			var bitly = new Bitly( bot.config.bitly.username, bot.config.bitly.password );
			bitly.shorten( url.href, function ( err, res ) {
				if ( err ) {
					return; // fail silently (usually duplicate URL)
				}
				if ( LOG[res.data.hash] ) {
					if ( LOG[res.data.hash] ) {
						bot.shout( to, res.data.url + ' (ofn)' );
					} else {
						bot.shout( to, res.data.url + ' (ofn ×' + LOG[res.data.hash] + ')' );
					}
					LOG[res.data.hash]++;
				} else {
					LOG[res.data.hash] = 1;
					if ( res.data.url && res.data.url.length < url.href.length ) {
						bot.shout( to, res.data.url );
					}
				}
				fs.writeFile( LOGFILE, JSON.stringify( LOG, null, 4 ) );
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
