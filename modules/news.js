var parse5 = require( 'parse5' );
var oldnews = {};

/**
 * JavaScript thinks that {a:1} doesn't equal {a:1},
 * so this function is a work-around to get that to work.
 */
function isEqualObj( a, b ) {
	return JSON.stringify( a ) === JSON.stringify( b );
}

module.exports = {
	events: {
		/**
		 * The rawnews event is defined in plugins/news.js, and triggers on each poll
		 * of the BBC News API. Here, we extract useable data from the rather idiosyncratic API
		 * and send it to the news event.
		 */
		rawnews: function ( bot, html, audience ) {
			// The BBC sends a JSON file with strings of HTML; we need to drill down
			// two levels to the important bit (this is terrible)
			var nodes = parse5.parseFragment( html ).childNodes[0].childNodes[1].childNodes;
			var news = {audience: audience};
			var body = null;

			for ( var i = 0; i < nodes.length; i++ ) {
				var curr = nodes[i];
				if ( curr.tagName === 'a' ) {
					for ( var j = 0; j < curr.attrs.length; j++ ) {
						if ( curr.attrs[j].name === 'href' ) {
							news.url = curr.attrs[j].value;
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
		news: function ( bot, news ) {
			if ( !oldnews[news.id] || !isEqualObj( oldnews[news.id], news ) ) {
				var str = '\u000305' + news.prompt + ':\x0F ' + news.text;
				str += '\u000314 http://bbc.co.uk' + news.url + ' \u00036(' + news.audience.toLowerCase() + ')';

				bot.notice( bot.config.irc.control, str );
				oldnews[news.id] = news;
			}

		}
	}
};

