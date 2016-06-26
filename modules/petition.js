var request = require( 'request' );
module.exports = {
	commands: {
		petition: {
			help: 'Displays information about United Kingdom Parliamentary e-petitions',
			command: function ( bot, msg ) {
				var id = '131215'; // Brexit referendum re-run
				if ( msg.args[1] ) {
					id = msg.args[1];
				}

				request.get( 'https://petition.parliament.uk/petitions/' + id + '.json', function ( e, r, b ) {
						if ( e ) {
							return 'problem fetching data';
						}
						if ( r.statusCode !== 200 ) {
							return 'problem fetching data (' + r.statusCode + ')';
						}
						var data = JSON.parse( b ).data;
						var ret = [
							data.type,
							data.id,
							'(' + data.attributes.action + ')',
							'has',
							data.attributes.signature_count,
							'signatures',
							'(' + data.attributes.state + ')',
							'https://petition.parliament.uk/petitions/' + data.id
						];
						bot.say( msg.to, msg.nick + ': ' + ret.join( ' ' ) );
					} );
				}
			}
		}
};
