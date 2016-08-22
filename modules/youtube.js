/**
 * To use this module, add youtube.key to your config.json
 * You need the key for the Youtube Data API:
 * https://console.developers.google.com/apis/credentials
 */
var yt = require( 'youtube-search' );
module.exports = {
	events: {
		'url:youtube.com': function ( bot, url, nick, to ) {
			var query = url.query;
			if ( typeof query === 'string' ) {
				// docs say it could already be an object
				var params = url.query.split( '&' );
				query = {};
				// this is dumb:
				for ( var i = 0; i < params.length; i++ ) {
					var curr = params[i].split( '=' );
					curr.push( null ); // to prevent ?foo breaking things
					query[curr[0]] = curr[1];
				}
			}
			console.log( JSON.stringify( query.v ) );
			if ( query.v ) {
				// TODO: remove this code duplication
				var opts = bot.config.youtube || {};
				opts.maxResults = 1;
				opts.type = 'video,channel';
				// this is particularly dumb:
				yt( query.v, opts, function ( err, results ) {
					if ( err ) {
						console.log( 'YouTube error', err, err.stack );
						return;
					}
					if ( results.length !== 0 ) {
						bot.say( to, results[0].title );
					}
				} );
			}
		}
	},
	commands: {
		yt: {
			help: 'Searches YouTube for a query string',
			aliases: [ 'youtube' ],
			command: function ( bot, msg ) {
				msg.args.shift();
				var query = msg.args.join( ' ' );
				var opts = bot.config.youtube || {};
				opts.maxResults = 1;
				opts.type = 'video,channel';
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
