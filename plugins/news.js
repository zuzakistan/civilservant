var NEWS_URL = 'http://polling.bbc.co.uk/news/latest_breaking_news?audience=';
var NEWS_AUDIENCES = [
	'Domestic',
	'International',
	'US'
];
var request = require( 'request' );

var bot = require( '..' );

var poll = function ( audience ) {
	request( NEWS_URL + audience, function ( err, res, body ) {
		var data = JSON.parse( body );
		if ( data.html !== '' ) {
			bot.fireEvents( 'rawnews', data.html, audience );
		}
		setTimeout( poll, data.pollPeriod );
	} );
};

for ( var i = 0; i < NEWS_AUDIENCES.length; i++ ) {
	console.log( 'Polling ' + NEWS_AUDIENCES[i] + ' BBC News' );
	poll( NEWS_AUDIENCES[i] );
}
