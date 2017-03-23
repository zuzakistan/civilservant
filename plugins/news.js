var BBC_NEWS_URL = 'http://polling.bbc.co.uk/news/latest_breaking_news?audience=Domestic';
var GDN_NEWS_URL = 'https://api.nextgen.guardianapps.co.uk/news-alert/alerts';
var REU_NEWS_URL = 'http://uk.reuters.com/assets/breakingNews?view=json';
var request = require( 'request' );

var bot = require( '..' );

var poll = function () {
	request( BBC_NEWS_URL, function ( err, res, body ) {
		if ( err ) { throw err; }
		console.log('bbc');
		var data;
		try {
			data = JSON.parse( body );
		} catch ( e ) {
			if ( e instanceof SyntaxError ) {
				bot.shout( bot.config.irc.control, 'bbc news feed playing up' );
				console.log( body, res );
				return;
			} else {
				throw e;
			}
		}
		if ( data.html !== '' ) {
			bot.fireEvents( 'rawnews:bbc', data.html );
		}
		setTimeout( poll, data.pollPeriod ? data.pollPeriod : 30000 );
	} ); request( GDN_NEWS_URL, function ( err, res, body ) { console.log('gdn');
		if ( !err ) {
			var data;
			try {
				data = JSON.parse( body );
			} catch ( e ) {
				if ( e instanceof SyntaxError ) {
					bot.shout( bot.config.irc.control, 'guardian feed playing up' );
					console.log( body, res );
					return;
				} else {
					bot.shout( bot.config.irc.control, 'guardian feed really playing up' );
					// throw e;
				}
			}
			bot.fireEvents( 'rawnews:gdn', data.collections );
		}
	} );
	request( REU_NEWS_URL, function ( err, res, body ) {
		if ( !err ) {
			console.log('reu');
			var data;
			try {
				data = JSON.parse( body );
			} catch ( e ) {
				// reuters send "" not "{}" on no-news
				if ( e instanceof SyntaxError ) {
					return false;
				}
				throw e;
			}
			bot.fireEvents( 'rawnews:reuters', data );
			console.log( 'REU', data );
		}
	} );
};

poll();
