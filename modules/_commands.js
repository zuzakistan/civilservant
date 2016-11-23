/**
 * Main logic for the other commands live here.
 */
module.exports = {
	events: {
		message: function ( bot, nick, to, text, message ) {
			if ( text.substr( 0, 1 ) === bot.config.irc.controlChar ) {
				var msg = {
					args: text.substr( 1 ).split( ' ' ),
					nick: nick,
					to: to,
					text: text,
					message: message
				};
				msg._cmd = bot.config.irc.controlChar + msg.args[0];
				if ( bot.commands.hasOwnProperty(msg.args[0]) ) {
					try {
						var cmd = bot.commands[msg.args[0]];
						if ( cmd.command ) {
							if ( cmd.disabled ) {
								return;
							}
							if ( cmd.privileged ) {
								if ( bot.config.irc.control !== msg.to ) {
									if ( bot.config.irc.insecure === true ) {
										// pass
									} else {
										// http://www.imdb.com/title/tt0062622/quotes?item=qt0396921
										bot.say( msg.to, 'I\'m sorry, ' + msg.nick + '. I\'m afraid I can\'t do that.' );
										return;
									}
								}
							}
							if ( cmd.usage ) {
								if ( msg.args.length !== cmd.usage.length + 1 ) {
									return bot.say( msg.to, msg.nick + ': Usage: ' + msg._cmd + ' <' + cmd.usage.join( '> <' ) + '>' );
							}
								msg.args = msg.args.reduce( function ( o, p, k ) {
									o[k] = p;
									return o;
								}, {} );
								for ( var i = 0; i < cmd.usage.length; i++ ) {
									msg.args[cmd.usage[i]] = msg.args[i + 1];
								}
							}
							cmd = cmd.command;
						}
						if ( typeof cmd === 'function' ) {
							var output = cmd( bot, msg );
							if ( typeof output === 'string' ) {
								bot.say( msg.to, msg.nick + ': ' + output );
							}
						}
					} catch ( e ) {
						bot.say( bot.config.irc.control,'Error processing `' + msg._cmd + '` in ' + msg.to + ': ' + e );
						console.error( e.message );
						console.error( e.stack );
					}
				} else {
					console.log( 'Unknown command: ' + text );
				}
			}
		}
	}
};

