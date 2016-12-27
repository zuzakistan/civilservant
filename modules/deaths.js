/**
 * Counts the number of times the BBC News homepage contains words commonly
 * used within death reports. Possibly useful for determining how awful
 * a certain day has been.
 */
var request = require( 'request' );

module.exports = {
	commands: {
		deaths: {
			help: 'Counts the occurrences of various morbid words on the BBC News homepage',
			command: function ( bot, msg ) {
				request( 'http://www.bbc.co.uk/news/', function ( e, r, b ) {
					if ( e ) {
						bot.say( msg.to, 'unable to reach BBC News' );
					}
					var words = [
						'dies',
						'dead',
						'obituary',
						'died',
						'killed',
						'murdered'
					];
					var count = 0;
					for ( var i = 0; i < words.length; i++ ) {
						count += b.split( words[i] ).length - 1;
					}
					bot.say( msg.to, msg.nick + ': ' + count );
				} );
			}
		}
	}
};
