var express = require( 'express' );
var bot = require( '..' );
var app = express();

app.use( express.bodyParser() );

app.get('/', function(req, res) {
	res.json( {'message':'go away'} );
} );

app.post('/notification', function ( req, res ) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	bot.notice( bot.config.irc.control, '<' + ip + '> ' + req.body.message.replace( /(?:\r\n|\r|\n)/g, '' ) );
	res.json( {'message':'done'} );
} );

app.listen(bot.config.web.port);

module.exports = app;
