var request = require( 'request' );

module.exports = {
	commands: {
		geo: {
			help: 'Returns a country code associated with a certain IP address',
			usage: [ 'ip' ],
			command: function ( bot, msg ) {
				request( 'https://freegeoip.net/json/' + msg.args.ip, function ( e, r, b ) {
					if ( e ) {
						bot.say( msg.to, 'unable to reach GeoIP service' );
					}
					var dat = JSON.parse( b );
					bot.say( msg.to, dat.ip + ' → ' + dat.country_code );
				} );
			}
		}
	}
};
