var bot = require( '..' );
var suncalc = require( 'suncalc' );
require( 'date-util' );

bot.addListener( 'message', function ( nick, to, text ) {
	var args = text.split( ' ' );
	if ( args[0] === '!sunrise' ) {
		var date = new Date();
		if ( args[1] ) {
			args.shift();
			date = new Date().strtotime( args.join(' ') );
		}
		var times = suncalc.getTimes( date, 54.4140, -4.0810 );
		bot.say( to, 'On ' + times.sunrise.format( 'dS mmm yyyy' ) + ', the sun rises at ' + times.sunrise.format( 'HH:MM' ) + ' and sets at ' + times.sunset.format( 'HH:MM') + ', with solar noon at ' + times.solarNoon.format( 'HH:MM' ) + ' and the nadir at ' + times.nadir.format( 'HH:MM Z' ) );
	}
} );
