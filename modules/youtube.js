/**
 * To use this module, add youtube.key to your config.json
 * You need the key for the Youtube Data API:
 * https://console.developers.google.com/apis/credentials
 */
var yt = require( 'youtube-search' );
module.exports = {
	commands: {
		yt: {
			help: 'Searches YouTube for a query string',
			aliases: [ 'youtube' ],
			command: function ( bot, msg ) {
				msg.args.shift();
				var query = msg.args.join( ' ' );
				var opts = bot.config.youtube || {};
				opts.maxResults = 1;
				yt( query, opts, function ( err, results ) {
					if ( err ) {
						return bot.say( msg.to, msg.nick + ': ' + err );
					}
					var result = results[0];
					bot.say( msg.to, msg.nick + ': ' + result.link + ' ' + result.title );
				} );
			}
		}
	}
};
