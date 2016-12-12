var scrape = require( 'scrape' );
var request = require( 'request' );
module.exports = {
	commands: {
		marco: {
			help: 'Checks current status of local takeaway',
			command: function ( bot, msg ) {
				var marco = bot.config.touchtosuccess.url[0];
				scrape.request( marco, function ( err, $ ) {
					if ( err ) {
						return;
					}
				$( 'img' ).each( function ( pre ) {
					var curr = pre.attribs.src;
					if ( curr.indexOf( 'current_time' ) !== -1 ) {
						curr = curr.split( '_' );
						curr = [curr[3], curr[4].split( '.png' )[0]];
						bot.say( msg.to, msg.nick + ': Collection time is ' + curr[0] + ' minutes. Delivery time is ' + curr[1] + ' minutes.' );
					}
				} );
					$( 'div.alert h2' ).each( function ( h2 ) {
						bot.say( msg.to, msg.nick + ': ' + h2.text );
					} );
				} );
			}
		},
		pizza: {
			help: 'Returns a random pizza from the local takeaway',
			command: function ( bot, msg ) {
				var marco = bot.config.touchtosuccess.url[0];
				scrape.request( marco, function ( err, $ ) {
					if ( err ) {
						return console.error( err );
					}
					var pizzas = [];
					$( 'div.subcat_name a' ).each( function ( a ) {
						pizzas.push( a.text );
						}
					);
					bot.say( msg.to, msg.nick + ': ' + pizzas[Math.floor( Math.random() * pizzas.length )] );
				} );
			}
		},
		order: {
			help: 'Checks the status of an order at Marco',
			usage: [ 'id' ],
			command: function ( bot, msg ) {
				request.get( 'http://newmarco.co.uk/data.php?do=track&track=' + msg.args.id , function ( e, r, b ) {
					if ( e ) {
						bot.say( msg.to, 'Error ' + JSON.stringify( e ) );
					} else {
						var d = b.split( '|' );
						if ( d[0] === 'Your order has been accepted.' ) {
							d[0] = '\u000310Accepted…';
						} else if ( d[0] === 'Your order is cooking.' ) {
							d[0] = '\u00039Cooking!\u0003';
						} else if ( d[0] === '' ) {
							d[0] = '\u000314Cancelled?\u0003';
						}
						var str = msg.nick + ': ' + d[0] + ' ';
						if ( (parseInt( d[4], 10 ) + parseInt( d[6], 10 ) ) === 0 ) {
							str += '(\u00034overdue!\u0003)';
						} else {
							str += '(ETA ' + d[4] + 'm' + d[6] + 's)';
						}
						str += '\u000314 ' + d[2];

						bot.say( msg.to, str );
					}
				} );
			}
		},
		lush: {
			help: 'Checks current status of local takeaway',
			command: function ( bot, msg ) {
				var marco = bot.config.touchtosuccess.url[1];
				scrape.request( marco, function ( err, $ ) {
					if ( err ) {
						return;
					}
				$( 'img' ).each( function ( pre ) {
					var curr = pre.attribs.src;
					if ( curr.indexOf( 'current_time' ) !== -1 ) {
						curr = curr.split( '_' );
						curr = [curr[3], curr[4].split( '.png' )[0]];
						bot.say( msg.to, msg.nick + ': Collection time is ' + curr[0] + ' minutes. Delivery time is ' + curr[1] + ' minutes.' );
					}
				} );
					$( 'div.alert h2' ).each( function ( h2 ) {
						bot.say( msg.to, msg.nick + ': ' + h2.text );
					} );
				} );
			}
		},
	}
};
