var bot = require('..');
var dgram = require('dgram');
var server = dgram.createSocket('udp4');
server.on('message', function ( msg, rinfo ) {
	bot.notice( bot.config.irc.control, '{' + rinfo.address + '} ' + msg.toString().replace( /(?:\r\n|\r|\n)/g, '' ) );
} );
server.bind( bot.config.udp.port );
console.log( 'Listening for UDP packets on ' + bot.config.udp.port );

var server2 = dgram.createSocket( 'udp4' );
server2.on('message', function ( msg, rinfo ) {
	bot.notice( '#abercs', '[' + rinfo.address + '] ' + msg.toString().replace( /(?:\r\n|\r|\n)/g, '' ) );
} );
server2.bind( 41340 );
