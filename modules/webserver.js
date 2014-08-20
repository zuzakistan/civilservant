var express = require( 'express' );
var bot = require( '..' );
var app = express();

app.get('/', function(req, res) {
	res.json( {'message':'go away'} );
} );

app.listen(bot.config.web.port);

module.exports = app;
