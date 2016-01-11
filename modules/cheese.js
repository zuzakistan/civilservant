var scrape = require( 'scrape' );
module.exports = {
	commands: {
		cheese: {
			help: 'Returns the Cheese of the Day',
			command: function ( bot, msg ) {
				scrape.request( 'http://www.cheese.com', function ( err, $ ) {
					if ( err ) {
						return;
					}
					$( 'div.top-offer' ).each( function ( div ) {
						var a = div.find( 'a' ).first();
						bot.say( msg.to, msg.nick + ': ' + a.text + ' http://www.cheese.com' + a.attribs.href );
					} );
				} );
			}
		}
	}
};
