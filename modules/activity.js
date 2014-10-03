var bot = require( '..' );
var web = require( './webserver' );
var chans  = {};
var nicks = {};

bot.addListener( 'message', function ( nick, to ) {
	var now = new Date();
	chans[to] = {
		nick: nick,
		time:now.getTime()
	};
	nicks[nick] = {
		chan: to,
		time: now.getTime()
	};
} );


web.get( '/activity.json', function ( req, res ) {
	res.header( 'Access-Control-Allow-Origin', '*' );
	res.header( 'Access-Control-Allow-Headers', 'X-Requested-With' );
	res.json( { 'chans': chans, 'nicks': nicks } );
} );
