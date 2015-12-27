var config = require( './config.json' );
var githash = require( 'githash' );
var irc = require( 'irc' );

var bot = new irc.Client( config.irc.server, config.irc.nick, config.irc );
bot.config = config;

module.exports = bot;

bot.reload = function () {
	return require( './modules' ).loadAllModules( bot );
};

if ( !bot.config.quiet ) {
	console.log( 'civilservant ' + githash() );
}
bot.reload();

bot.fireEvents = function () {
	var args = Array.prototype.slice.call( arguments ); // courtesy of MDN
	var name = args.shift();

	try { // events can fire mid-reload
		if ( bot.events[name] ) {
			for ( var i = 0; i < bot.events[name].length; i++ ) {
				var cargs = args;
				cargs.unshift( bot );
				bot.events[name][i].apply( this, cargs );
			}
		}
	} catch ( e ) {
		// nowt
	}
};

bot.addListener( 'message', function ( nick, to, text, message ) {
	bot.fireEvents( 'message', nick, to, text, message );
} );

bot.addListener( 'pm', function ( nick, text, message ) {
	bot.fireEvents( 'message', nick, nick, text, message );
} );

