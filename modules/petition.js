var request = require( 'request' );
var delta = {};
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
						try {
							var data = JSON.parse( b ).data;

							var old = delta[data.id] ? delta[data.id] : data.attributes.signature_count;
							var change = data.attributes.signature_count - old;
							delta[data.id] = old + change;

							var ret = [
								data.attributes.state,
								data.type,
								data.id,
								'"' + data.attributes.action + '"',
								'has',
								data.attributes.signature_count,
								'signatures',
								'(+' + change + ')',
								'https://petition.parliament.uk/petitions/' + data.id
							];
							return ret.join( ' ' );
						} catch ( e ) {
							return 'unable to parse JSON';
						}
					} );
				}
			}
		}
};
