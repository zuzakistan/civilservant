var request = require( 'request' );
var util = require('util');
var delta = {};
var id = null;

var TICKER_API = 'https://foo.bar';
var SYMBOL_API_FMT = "https://query.yahooapis.com/v1/public/yql?q=select%%20*%%20from%%20yahoo.finance.quotes%%20where%%20symbol%%20in%%20(%%22%s%%22)&format=json&env=store%%3A%%2F%%2Fdatatables.org%%2Falltableswithkeys&callback=";
var RESULT_FMT = "%s (%s): %s (%s)";

function get_sym(symbol, cb) {
    /* cb should accept e, r { value, delta, % delta } */
    var req = util.format(SYMBOL_API_FMT, symbol);

    request.get( req, function (e, r, b) {
        if ( e ) {
            cb (e, r, b);
            return 'problem fetching data';
        }
        if ( r.statusCode !== 200 ) {
            cb ("bad status code", r, b);
            return 'problem fetching data (' + r.statusCode + ')';
        }

        var data = JSON.parse(b);
        var symboldata = data.query.results.quote;
        
        cb (e, symboldata);
    });
}

module.exports = {
	commands: {
		yhoo: {
			help: 'Displays information about a ticker symbol via yahoo',
			command: function ( bot, msg ) {
				if ( msg.args[1] ) {
					id = msg.args[1];
				}
                
                if ( id == null ) {
                    bot.say( msg.to, "No previous symbol" );
                    return;
                }

                get_sym(id, function(e, r) {
                    if ( e ) {
                        return "Problem fetching symbol";
                    }

                    var line = util.format(RESULT_FMT,
                            r.symbol,
                            r.Name,
                            r.Ask,
                            r.Change_PercentChange);
                    bot.say(msg.to, line);
                });
			}
		}
    }
};
