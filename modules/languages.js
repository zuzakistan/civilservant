var langs = require( 'languages' );
var countries = require( 'i18n-iso-countries' );
var states = require( 'us-states' );
var currencies = require( 'currency-codes' );

module.exports = {
	commands: {
		currency: {
			help: 'Looks up an ISO 4217 currency code',
			usage: [ 'currency' ],
			command: function ( bot, msg ) {
				var code = currencies.code( msg.args.currency );
				if ( code ) {
					if ( code.countries ) {
						return code.code + ' → ' + code.currency + ' (' + code.countries.join( ', ' ) + ')';
					} else {
						return code.code + ' → ' + code.currency;
					}
				} else {
					return 'ISO code not found.';
				}
			}
		},
		lang: {
			help: 'Looks up an ISO 369-1 language code',
			usage: [ 'lang' ],
			command: function ( bot, msg ) {
				msg.args.lang = msg.args.lang.toLowerCase();
				if ( langs.isValid( msg.args.lang ) ) {
					var info = langs.getLanguageInfo( msg.args.lang );
					return msg.args.lang + ' → ' + info.name + ' · ' + info.nativeName;
				} else {
					return 'Invalid ISO 639-1 code.';
				}
			}
		},
		country: {
			help: 'Looks up an ISO 3166 alpha2 country code',
			usage: [ 'country' ],
			command: function ( bot, msg ) {
				var code = msg.args.country.toUpperCase();
				if ( countries.getName( code, 'en' ) ) {
					return code + ' → ' + countries.getName( code, 'en' ) + ' · ' + countries.getName( code, 'de' );
				} else {
					return 'ISO 3166-alpha2 code not found.';
				}
			}
		},
		state: {
			help: 'Looks up the postal abbbreviation for a US state',
			usage: [ 'code' ],
			command: function ( bot, msg ) {
				var code = msg.args.code.toUpperCase();
				if ( states[code] ) {
					return code + ' → ' + states[code];
				} else {
					return 'USPS code not found';
				}
			}
		}
	}
};
