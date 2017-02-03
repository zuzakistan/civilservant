var NEWS_URL = 'http://polling.bbc.co.uk/news/latest_breaking_news?audience=Domestic';
var request = require( 'request' );

var bot = require( '..' );

var poll = function () {
	request( NEWS_URL, function ( err, res, body ) {
		var data = JSON.parse( body );
		if ( data.html !== '' ) {
			bot.fireEvents( 'rawnews', data.html );
		}
		setTimeout( poll, data.pollPeriod );
	} );
};

poll();
