/**
 * marco.js
 *
 * !marco
 * Returns the delivery and collection times of my favourite takeaway.
 *
 * !pizza
 * Returns a random pizza from the "classic" range.
 *
 */
var scrape = require('scrape');
var bot = require('..');

bot.addListener( 'message', function ( nick, to, text ) {
	var marco = bot.config.touchtosuccess.url;
	if ( text === '!marco' ) {
		scrape.request(marco, function ( err, $ ) {
			if ( err ) {
				return;
			}
			$( 'img' ).each( function ( pre ) {
				var curr = pre.attribs.src;
				if ( curr.indexOf( 'current_time' ) !== -1 ) {
					curr = curr.split( '_' );
					curr = [curr[3], curr[4].split('.png')[0]];
					bot.say(to, nick + ': Collection time is ' + curr[0] + ' minutes. Delivery time is ' + curr[1] + ' minutes.');
				}
			} );
			$( 'div.alert h2' ).each( function ( h2 ) {
				bot.say( to, nick + ': ' + h2.text );
			} );
		} );
	} else if ( text === '!pizza') {
		scrape.request( marco, function ( err, $ ) {
			if ( err ) {
				return console.error( err );
			}
			var pizzas = [];
			$( 'div.subcat_name a' ).each( function ( a ) {
				console.log( a );
				pizzas.push( a.text );
				}
			);
			console.log(pizzas);
			bot.say( to, nick + ': ' + pizzas[Math.floor( Math.random() * pizzas.length )] );
		} );
	}
} );
