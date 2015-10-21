/**
 * finger.js
 *
 * Uses the finger command to look up details about arbitrary users.
 *
 * No longer useful unless running on the Aberystwyth network, as
 * remote fingering has been disabled for several years.
 *
 * !finger <username>
 * Fingers a user on central.aber.ac.uk
 *
 * @deprecated
 */
var bot = require( '..' );
var exec = require( 'child_process' ).exec;

bot.addListener( 'message', function ( nick, to, text ) {
	var args = text.split( ' ' );
	if ( args[0] === '!finger' ) {
	if( !args[1] ) {
		bot.say( to, 'Usage: !finger <user>' );
		return;
	}
	var username = args[1];
	exec( 'finger -s ' + username + '@central.aber.ac.uk', function ( err, stdout ) {
		stdout = stdout.replace( /(\r\n|\n|\r)/gm, '' );

		var name = stdout.search( 'Name:' );
		stdout = stdout.substring( name );

		var ret = stdout.search('Dir');
		stdout = stdout.substring(6,ret);

		if ( stdout === 'Welcom' ) {
			bot.say( to,'Unable to find ' + username );
		} else {
			bot.say( to,username + ' → ' + stdout );
		}
	} );
	}
} );
