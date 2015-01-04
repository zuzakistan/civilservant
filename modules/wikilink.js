var bot = require( '..' );
var fs = require( 'fs' );
var langs = require( 'languages' );
var iw = __dirname + '/interwikis.json';

bot.addListener( 'message', function( nick, to, text ){
	var regexp = /\[\[(.*?)(?:\|.*?)?\]\]/g;
	var match = regexp.exec( text );
	if ( match ) {
		match = match[1];
		var namespace = 'w';
		if ( match.split(':').length !== 1 ) {
			match = match.split(':');
			namespace = match.shift();
			match = match.join(':');
		}
		fs.readFile( iw, 'utf8', function (e, d) {
			if (e) {
				console.log( JSON.stringify( e ) );
				return;
			}
			d = JSON.parse( d );
			var str = '';
			if ( d[namespace] ) {
				str = d[namespace].replace( '$1', match );
			} else {
				match = match.charAt( 0 ).toUpperCase() + match.slice( 1 );
				if ( langs.isValid(namespace) ) {
					str = 'https://' + namespace + '.wikipedia.org/wiki/' + match;
				} else if ( namespace === 'w' ) {
					str = 'https://en.wikipedia.org/wiki/'+match;
				} else {
					str = 'https://en.wikipedia.org/wiki/'+namespace+':'+match;
				}
			}
			bot.say(to,str.replace(/ /g,'_'));
		});
	}
});
