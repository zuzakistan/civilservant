var request = require( 'request' );
module.exports = {
	commands: {
		fact: {
			help: 'Gets a number fact',
			command: function ( bot, msg ) {
				var url = 'http://numbersapi.com/';
				if ( msg.args.length < 2 ) {
					return 'Usage: ' + msg.args[0] + ' <number> (year|math|)';
				}
				url += msg.args[1];
				if ( msg.args.length === 3 ) {
					switch ( msg.args[2] ) {
						case 'math':
						case 'year':
							url += '/' + msg.args[2];
							break;
						default:
							return 'Usage: ' + msg.args[0] + ' <number> (year|math|)';
					}
				}

				request.get( url, function ( e, r, b ) {
						if ( e ) {
							bot.say( msg.to, 'problem fetching data' );
						}
						if ( r.statusCode !== 200 ) {
							bot.say( msg.to, 'problem fetching data (' + r.statusCode + ')' );
						}
						bot.say( msg.to, msg.nick + ': ' + b );
					} );
				}
			}
		}
};
