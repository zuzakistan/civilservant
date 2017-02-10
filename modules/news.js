var parse5 = require( 'parse5' );
var write = require( 'fs' ).writeFile;
var colors = require( 'irc' ).colors;
var Bitly = require( 'bitly' );

var oldnews = {};

/**
 * JavaScript thinks that {a:1} doesn't equal {a:1},
 * so this function is a work-around to get that to work.
 */
function isEqualObj( a, b ) {
	return JSON.stringify( a ) === JSON.stringify( b );
}

module.exports = {
	onload: function () {
		oldnews = require( __rootdir + '/data/news.json' ) || {};
	},
	events: {
		/**
		 * The rawnews event is defined in plugins/news.js, and triggers on each poll
		 * of the BBC News API. Here, we extract useable data from the rather idiosyncratic API
		 * and send it to the news event.
		 */
		'rawnews:bbc': function ( bot, html ) {
			// The BBC sends a JSON file with strings of HTML; we need to drill down
			// two levels to the important bit (this is terrible)
			var nodes = parse5.parseFragment( html ).childNodes[0].childNodes[1].childNodes;
			var news = { color: 'light_red' };
			var body = null;

			for ( var i = 0; i < nodes.length; i++ ) {
				var curr = nodes[i];
				if ( curr.tagName === 'a' ) {
					for ( var j = 0; j < curr.attrs.length; j++ ) {
						if ( curr.attrs[j].name === 'href' ) {
							news.url = 'http://bbc.co.uk' + curr.attrs[j].value;
							if ( news.url.startsWith( '/sport' ) === true ) {
								news.color = 'yellow';
							}
						} else if ( curr.attrs[j].name === 'data-asset-id' ) {
							news.id = curr.attrs[j].value;
						}
					}
					body = curr.childNodes;
					continue;
				}
			}

			for ( i = 0; i < body.length; i++ ) {
				if ( body[i].tagName === 'h2' ) {
					news.prompt = body[i].childNodes[0].value;
				} else if ( body[i].tagName === 'p' ) {
					news.text = body[i].childNodes[0].value;
				}
			}

			bot.fireEvents( 'news', news );
		},
		'rawnews:gdn': function ( bot, stories ) {
			for ( var i = 0; i < stories.length; i++ ) {
				// at least the Guardian has a decent API
				var curr = stories[i];
				var GUARDIAN_THEATRES = [ 'uk' ];
				for ( var j = 0; j < curr.content.length; j++ ) {
					if ( GUARDIAN_THEATRES.indexOf( curr.href ) !== -1 ) {
						bot.fireEvents( 'news', {
							color: 'dark_blue',
							id: curr.content[j].uid,
							text: curr.content[j].headline,
							prompt: 'Guardian',
							tail: curr.href,
							url: curr.content[j].shortUrl
						} );
					}
				}
			}
		},
		news: function ( bot, news ) {
			if ( !oldnews[news.id] || !isEqualObj( oldnews[news.id], news ) ) {
				var bitly = new Bitly( bot.config.bitly.username, bot.config.bitly.password );
				bitly.shorten( news.url, function ( err, res ) {
					var str = colors.wrap( news.color,  news.prompt + ':' );
					str += ' ' + news.text;
					str += ' ' + colors.wrap( 'gray', res.data.url );
					if ( news.tail ) {
						str += ' ' + colors.wrap( 'magenta', '(' + news.tail + ')' );
					}

					bot.broadcast( str );
				} );
				oldnews[news.id] = news;
				write( __rootdir + '/data/news.json', JSON.stringify( oldnews ) );
			}

		}
	}
};

