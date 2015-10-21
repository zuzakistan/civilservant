/**
 * iss.js
 *
 * !space
 * Returns data on the number of people in space at the current time.
 */
var bot = require( '..' );
var request = require( 'request' );
bot.addListener( 'message', function ( nick, to, text ) {
	if ( text === '!space' ) {
		request.get( 'http://www.howmanypeopleareinspacerightnow.com/peopleinspace.json', function ( e, r, b ) {
				if ( e ) {
					return bot.say( to, nick + ': problem fetching data' );
				}
				if ( r.statusCode !== 200 ) {
					return bot.say( to, nick + ': problem fetching data (' + r.statusCode + ')' );
				}
				var data = JSON.parse( b );
				var ret = '';
				for ( var i = 0; i < data.people.length; i++ ) {
					ret += data.people[i].name + ' (' + data.people[i].country + ')';
					ret += '; ';
				}
				ret = ret.substring( 0, ret.length - 2 );
				bot.say( to, nick + ': ' + ret );
			}
		);
	}
} );

