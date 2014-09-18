var bot = require( '..' );
var irc = require( 'irc' );
var wikipedia = new irc.Client( 'irc.wikimedia.org', 'civilservant', {
  port:6667,channels:[
	'#en.wikipedia','#en.wikinews','#wikimania2014.wikimedia',
	'#en.wiktionary','#en.wikibooks','#en.wikiversity','#en.wikisource',
	'#en.wikivoyage','#meta.wikimedia','#commons.wikimedia']
} );

wikipedia.addListener( 'message', function ( nick, to, text ) {
	// mediawiki titles can never have a pipe in them, so this is almost safe
	if ( new RegExp( bot.config.wikipedia.watchlist.join( '|' ) ).test( text ) ) {
		bot.notice(bot.config.irc.control,text);
	}
} );
wikipedia.addListener( 'error', function ( err ) {
  console.log( err );
} );
console.log( 'Loaded RC reporting for English Wikipedia' );
