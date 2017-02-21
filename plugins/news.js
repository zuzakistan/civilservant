var BBC_NEWS_URL = 'http://polling.bbc.co.uk/news/latest_breaking_news?audience=Domestic';
var GDN_NEWS_URL = 'https://api.nextgen.guardianapps.co.uk/news-alert/alerts';
var REU_NEWS_URL = 'http://uk.reuters.com/assets/breakingNews?view=json';
var request = require( 'request' );

var bot = require( '..' );

var poll = function () {
	request( BBC_NEWS_URL, function ( err, res, body ) {
		console.log('bbc');
		var data = JSON.parse( body );
		if ( data.html !== '' ) {
			bot.fireEvents( 'rawnews:bbc', data.html );
		}
		setTimeout( poll, data.pollPeriod );
	} );
	request( GDN_NEWS_URL, function ( err, res, body ) {
		console.log('gdn');
		var data = JSON.parse( body );
		if ( err ) { throw err; }
		bot.fireEvents( 'rawnews:gdn', data.collections );
	} );
	request( REU_NEWS_URL, function ( err, res, body ) {
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
		if ( err ) { throw err; }
		bot.fireEvents( 'rawnews:reuters', data );
		console.log( 'REU', data );
	} );
};

poll();
