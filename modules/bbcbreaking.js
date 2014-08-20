var client = require( '..' );
var schedule = require( 'node-schedule' );
var request = require( 'request' );
var _ = require( 'underscore' );
var Bitly = require( 'bitly' );

var stale = [];
var stale2 = [];

var bitly = new Bitly( client.config.bitly.username, client.config.bitly.password );

var pulserule= new schedule.RecurrenceRule();
pulserule.second = [0,30];
var nox = true;

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
						var msg = '';
						if ( item.isBreaking === 'true' ) {
							if ( !_.contains( stale2, item.url ) ) {
								stale2.push( item.url );
								msg += '\u000315,5';
								msg += item.prompt;
								msg += ':';
								msg += '\u000315'; // white (so breaking stands out)
							} else {
								msg += '\u00035';
								msg += item.prompt;
								msg += ':';
								msg += '\u000315';
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
	} else if ( text === '!news corrections' ){
		client.say( to, nick + ': http://www.bbc.co.uk/news/21323537' );
	}
} );

