var client = require( '..' );
var Bitly = require( 'bitly' );

var bitly = new Bitly( client.config.bitly.username, client.config.bitly.password );

var urlregex = new RegExp( // may the lord have mercy on our souls
	'^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$',
	'g'
);

var last = [];

client.addListener( 'message', function ( nick, to, text ) {
	var curr = text.match( urlregex );
	if ( curr && curr.length !== 0 ) {
		last = curr;
	}
	var args = text.split( ' ' );
	if ( args[0] === '!shorten' ) {
		if ( args[1] ) {
			args.shift();
		} else {
			args = last;
		}
		args.forEach( function ( url ) {
			bitly.shorten( url, function ( err, response ) {
				if ( err ) {
					client.say( to, 'Error shortening URL.' );
				} else if ( response.data.url !== undefined ) {
					client.say( to, nick + ': ' +  response.data.url );
				}
			} );
		} );
	}
} );
