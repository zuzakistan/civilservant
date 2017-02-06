var bot = require( '..' );

bot.broadcast = function ( string ) {
	var chans = Object.keys( bot.chans );
	console.log( chans );
	for ( var i = 0; i < chans.length; i++ ) {
		bot.notice( chans[i], string );
	}
};
