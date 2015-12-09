var config = require( './config.json' );
var nicks = require( './names.json' );

var irc = require( 'irc' );

if ( config.irc.nick === 'random' ) {
	config.irc.nick = nicks[Math.floor( Math.random() * nicks.length)];
}
console.log(config.irc.nick);
var bot = new irc.Client( config.irc.server, config.irc.nick, config.irc );

bot.config = config;

module.exports = bot;

console.log('Hello!');

bot.setMaxListeners( 20 );
require('require-all')(__dirname + '/modules');
