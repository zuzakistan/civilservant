var scrape = require('scrape');
module.exports = {
	commands: {
		marco: {
			help: 'Checks current status of local takeaway',
			command: function ( bot, msg ) {
				var marco = bot.config.touchtosuccess.url;
				scrape.request(marco, function ( err, $ ) {
					if ( err ) {
						return;
					}
				$( 'img' ).each( function ( pre ) {
					var curr = pre.attribs.src;
					if ( curr.indexOf( 'current_time' ) !== -1 ) {
						curr = curr.split( '_' );
						curr = [curr[3], curr[4].split('.png')[0]];
						bot.say( msg.to, msg.nick + ': Collection time is ' + curr[0] + ' minutes. Delivery time is ' + curr[1] + ' minutes.');
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
				var marco = bot.config.touchtosuccess.url;
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
		}
	}
};
