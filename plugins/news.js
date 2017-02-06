var BBC_NEWS_URL = 'http://polling.bbc.co.uk/news/latest_breaking_news?audience=Domestic';
var GDN_NEWS_URL = 'https://api.nextgen.guardianapps.co.uk/news-alert/alerts';
var request = require( 'request' );

var bot = require( '..' );

var poll = function () {
	request( BBC_NEWS_URL, function ( err, res, body ) {
		var data = JSON.parse( body );
		if ( data.html !== '' ) {
			bot.fireEvents( 'rawnews:bbc', data.html );
		}
		setTimeout( poll, data.pollPeriod );
	} );
	request( GDN_NEWS_URL, function ( err, res, body ) {
		var data = JSON.parse( body );
		if ( err ) { throw err; }
		bot.fireEvents( 'rawnews:gdn', data.collections );
	} );
};

poll();
