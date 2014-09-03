var client = require( '..' );
var schedule = require( 'node-schedule' );
var request = require( 'request' );
var _ = require( 'underscore' );
var Bitly = require( 'bitly' );
var slack = require('slack-notify')('https://' + client.config.slack.org + '.slack.com/services/hooks/incoming-webhook?token=' + client.config.slack.token );
var fs = require( 'fs' );

var stale = require( __dirname + '/stale.json' );
var stale2 = [];

var bitly = new Bitly( client.config.bitly.username, client.config.bitly.password );

var pulserule= new schedule.RecurrenceRule();
pulserule.second = [0,30];
var nox = false;

function articlePending() {
	var article = [
		'article',
		'column',
		'details',
		'feature',
		'news',
		'page',
		'report'
	];
	var pending = [
		'coming',
		'in abeyance',
		'in progress',
		'not yet available',
		'pending',
		'unfinished',
		'unpublished',
		'waiting'
	];
	return [
		article[Math.floor( Math.random() * article.length )],
		pending[Math.floor( Math.random() * pending.length )]
	];
}

function toTitleCase( str ) {
	return str.replace( /\w\S*/g, function ( txt ) {
		return txt.charAt( 0 ).toUpperCase() + txt.substr( 1 ).toLowerCase();
	} );
}

schedule.scheduleJob( pulserule, function () {
	request( 'http://www.bbc.co.uk/news/10284448/ticker.sjson', function( err, res, body ) {
		if ( err ) {
			console.log( err.message );
		} else {
			try {
				var data = JSON.parse( body );
				data.entries.forEach( function ( item ) {
					if ( !_.contains( stale, item.headline + '%' + item.url ) ) {
						stale.push( item.headline + '%' + item.url );
						fs.writeFile( __dirname + '/stale.json', JSON.stringify( stale, null, 4 ) );
						var msg = '';
						if ( item.isBreaking === 'true' ) {
							msg += '\u00035';
							msg += item.prompt;
							msg += ':';
							if ( !_.contains( stale2, item.url ) && !_.contains( stale2, item.headline ) ) {
								stale2.push( item.url );
								stale2.push( item.headline );
								msg += '\u0003 \u0002'; // white (so breaking stands out)
							} else {
								msg += '\u0003 ';
							}
						} else {
							var len = item.prompt.length;
							var color = 0;
							for ( var i = 0; i < len; i++ ) {
								color += item.prompt.charCodeAt( i );
							}
							color = color % 15;
							msg += '\u0003' + color + item.prompt + ':';
							msg += '\u0003 '; // cancel coloring
						}
						msg += item.headline;
						bitly.shorten( item.url, function ( err, response ) {
							if ( err ) {
								msg += item.url;
							} else if ( response.data.url !== undefined ) {
								msg += ' ' + response.data.url;
								if ( item.isLive === 'true' ) { // must be string
									msg += ' \u000313(live)\u0003';
								}
							} else {
								msg += ' \u00031<' + articlePending().join( ' ' ) + '>';
							}
							client.config.irc.channels.forEach( function ( chan ) {
								if ( !nox ) {
									client.notice(chan, msg);
								}
							} );
						} );
						slack.send( {
							channel: '#news',
							icon_url: 'https://i.imgur.com/Ikxp2g7.png',
							text: item.url ? '<' + item.url + '|' + item.headline + '>' : item.headline,
							username: 'BBC ' + toTitleCase( item.prompt ),
							color: item.isBreaking ? '#990000' : null,
							unfurl_links: true
						} );
					}
				} );
			} catch ( e ) {
				return;
			}
		}
	} );
} );

client.addListener( 'message', function ( nick, to, text ){
	if ( text === '!news' ) {
		if ( nox === false ) {
			nox = true;
			client.say( to, nick + ': BBC News feed silenced.' );
		} else {
			nox = false;
			client.say( to, nick + ': BBC News feed started.' );
		}
	} else if ( text === '!news corrections' ) {
		client.say( to, nick + ': http://www.bbc.co.uk/news/21323537' );
	} else if ( text === '!news status' ) {
		if ( nox === false ) {
			client.say( to, nick + ': BBC News feed is active.' );
		} else if ( nox === true ) {
			client.say( to, nick + ': BBC News feed is silenced.' );
		} else {
			client.say( to, nick + ': BBC News feed is buggered.' );
		}
	} else if ( text === '!news wipe' ) {
		stale = [];
		fs.writeFileSync( __dirname + '/stale.json', JSON.stringify( stale, null, 4 ) );
		client.say( to, nick + ': wiped history (brace for impact)' );
	}
} );


