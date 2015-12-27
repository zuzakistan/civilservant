var request = require( 'request' );
module.exports = {
	commands: {
		space: {
			help: 'Displays the people in space right now',
			command: function ( bot, msg ) {
				request.get( 'http://www.howmanypeopleareinspacerightnow.com/peopleinspace.json', function ( e, r, b ) {
						if ( e ) {
							return 'problem fetching data';
						}
						if ( r.statusCode !== 200 ) {
							return 'problem fetching data (' + r.statusCode + ')';
						}
						var data = JSON.parse( b );
						var ret = [];
						for ( var i = 0; i < data.people.length; i++ ) {
							if ( data.people[i].country === 'England' ) { // pet peeve
								data.people[i].country = 'United Kingdom';
							}
							ret.push( data.people[i].name + ' (' + data.people[i].country + ')' );
						}
						bot.say( msg.to, msg.nick + ': ' + ret.join( '; ' ) );
					} );
				}
			}
		}
};
