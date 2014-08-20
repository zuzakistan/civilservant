var bot = require( '..' );
var config = require( '../config.json' );
var irc = require( 'irc' );
var request = require( 'request' );
var _ = require( 'underscore' );
var changes = [ '144273', '154346', '154374' ];

var nox = new irc.Client( bot.config.irc.server, 'MC8-bot', {
	port: 6667,
	channels: [ '#mediawiki-feed' ],
	realName: 'Silent bot for reporting gerrit to private channels operated by MC8 [[user:microchip08]]',
	userName: config.irc.userName,
	password: config.irc.password
} );

nox.addListener( 'message', function ( nick, to, text, message ) {
	if ( nick == 'grrrit-wm' ) {
		for ( var i = 0; i > changes.length; i++ ) {
			if ( text.indexOf( 'https://gerrit.wikimedia.org/r/' + changes[len] ) != -1 ) {
				bot.notice( bot.config.irc.control, text );
				return;
			}
		}
	}
} );

bot.addListener( 'message', function ( nick, to, text, message ) {
	try {
		var args = text.split( ' ' );
		if ( args[0] == '!gerrit' ) {
			if ( args.length > 0 ) {
				if ( args[1] == 'list' ) {
					bot.say( to, nick + ': monitoring Gerrit changes r' + changes.join( ', r' ) );
				} else if ( args[1] == 'add' ) {
					if( args.length > 1 ) {
						if ( args[2] < 200000 ) {
							changes.push( args[2] );
							bot.say( to, nick + ': now watching Gerrit r' + args[2] );
						} else {
							if ( args[3] && args[3] == 'force' ) {
								changes.push( args[2] );
							} else {
								boy.say( to, nick + ': does not sound sane. Use !gerrit add ' + args[2] + ' force' );
							}
						}
					} else {
						bot.say( to, 'Usage: !gerrit add [changeset number]' );
					}
				} else if ( args[1] == 'sync' ) {
					request( 'http://files.chippy.ch/gerrit/gerrit.php?json', function ( e, r, b ) {
						if ( e ) {
							bot.say( to, 'Could not fetch change numbers.' );
							bot.say( to, e.message );
							return;
						}

						try {
							var d = JSON.parse( b );
							changes = _.union( d, changes );
							bot.say( to, 'Gerrit changes updated.' );
						} catch ( err ) {
							bot.say( to, 'Could not parse JSON.' );
							return;
						}
					} );
				} else {
					bot.say( to, 'Usage: !gerrit (add|list|sync)' );
				}
			} else {
					bot.say( to, 'Usage: !gerrit (add|list)' );
			}
		}
	} catch ( e ) {
		bot.say( to, nick + ': something went wrong when trying to add that' );
	}
} );

