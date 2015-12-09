/**
 * basicfunctions.js
 *
 * Governs a few simple administrative commands.
 *
 * !say <text>
 * Makes the bot NOTICE the current channel with the content.
 *
 * !src
 * Displays a link to the source code of the bot.
 *
 * !commands
 * !help
 * Displays a link to COMMANDS.md
 *
 * !quit
 * Checks to see whether the current channel is the control channel.
 *
 * !config flush
 * Cycles the configuration of the bot. [Control channel only.]
 */
var bot = require( '..' );

bot.addListener( 'message', function ( nick, to, text ) {
	if ( text.substr( 0, 4 ) === '!say' ) {
		bot.notice( to, text.substr( text.indexOf( ' ' ) + 1 ) );
	} else if ( text.substr( 0, 4 ) === '!src' ) {
		bot.say( to, nick + ': https://github.com/zuzakistan/civilservant' );
	} else if ( text.substr( 0, 5 ) === '!help' || text.substr( 0, 9 ) === '!commands' ) {
		bot.say( to, nick + ': https://github.com/zuzakistan/civilservant/blob/master/COMMANDS.md' );
	} else if ( text.substr( 0, 5 ) === '!quit' ) {
		if ( to === bot.config.irc.control ) {
			process.exit( 0 );
		} else {
			console.log( '!quit attempted by ' + nick + ' in ' + to  + ' (ignoring)');
		}
	} else if ( text === '!control' ) {
			if ( to === bot.config.irc.control ) {
			bot.say( to, nick + ': this is the control channel' );
		} else {
			bot.say( to, nick + ': this is not the control channel' );
		}
	} else if ( text === '!config flush' ) {
		if ( to === bot.config.irc.control ) {
			var oldconfig = bot.config;
			bot.config = require( '../config.json' );
			if ( bot.config === oldconfig ) {
				bot.say( to, nick + ': done, but no changes found' );
			} else {
				bot.say( to, nick + ': done' );
			}
		}
	}
} );
