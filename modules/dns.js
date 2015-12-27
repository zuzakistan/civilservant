var dns = require( 'dns' );

module.exports = {
	commands: {
		dns: {
			aliases: [ 'rdns', 'host' ],
			help: 'Attempts to look up a domain in the DNS system.',
			usage: [ 'host' ],
			command: function ( bot, msg ) {
				try {
					dns.reverse( msg.args.host, function ( err, data ) {
						if ( err ) {
							return err + ' ' + msg.args.host;
						} else {
							for ( var i = 0; i < data.length; i++ ) {
								return msg.args.host + ' → ' + data[i];
							}
						}
					} );
				} catch ( e ) {
					return e.message;
				}
			}
		}
	}
};
