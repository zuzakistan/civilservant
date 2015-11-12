/**
 * paste.js
 *
 * Administrative actions for a pastebin.
 *
 * !del <slug>
 * Deletes a paste.
 */
var bot = require( '..' );
var del = require( 'fs' ).unlink;
bot.addListener( 'message', function ( nick, to, text ) {
	var args = text.split( ' ' );
	if ( args[0] === '!del' && to === bot.config.irc.control ) {
		if ( args.length === 2 ) {
			del( bot.config.paste.path + '/' + args[1], function ( e ) {
				if ( e ) {
					bot.say( to, nick + ': ' + e );
				} else {
					bot.say( to, nick + ': purged http://paste.chippy.ch/' + args[1] );
				}
			} );
		} else {
			bot.say( to, nick + ': usage: !del <slug>' );
		}
	}
} );

