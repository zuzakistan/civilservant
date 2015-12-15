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
 *
 * !nick [nickname]
 * Changes the nickname of the bot. Fails silently.
 * Requires `bot.config.irc.allowNickChanges` cvar to be active.
 */
var bot = require( '..' );

bot.addListener( 'message', function ( nick, to, text ) {
	if ( text.substr( 0, 4 ) === '!say' ) {
		bot.notice( to, text.substr( text.indexOf( ' ' ) + 1 ) );
	} else if ( text === '!src' ) {
		bot.say( to, nick + ': https://github.com/zuzakistan/civilservant' );
	} else if ( text === '!help' || text === '!commands' ) {
		bot.say( to, nick + ': https://github.com/zuzakistan/civilservant/blob/master/COMMANDS.md' );
	} else if ( text  === '!quit' ) {
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
	} else if ( text.substr(0, 5) === '!nick' ) {
		if (!bot.config.irc.allowNickChanges) {
			return;
		}
		var args = text.split( ' ' );
		if ( to === bot.config.irc.control ) {
			if ( args[1] ) {
				bot.config.irc.nick = args[1];
			} else {
				var nicks = require('../names.json');
				bot.config.irc.nick = nicks[Math.floor( Math.random() * nicks.length )];
			}
			bot.send( 'NICK', bot.config.irc.nick );
		} else {
			// obligatory quote
			bot.say( to, 'I\'m sorry ' + nick + ', I\'m afraid I can\'t do that' );
		}
	}

} );
