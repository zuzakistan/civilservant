var config = require( './config.json' );

var irc = require( 'irc' );

var bot = new irc.Client( config.irc.server, config.irc.nick, config.irc );

bot.config = config;
bot.message = 'message';
if ( bot.config.irc.paranoid ) {
	bot.message = 'message' + bot.irc.control;
}

module.exports = bot;

console.log('Hello!');
require('require-all')(__dirname + '/modules');
