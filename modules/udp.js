module.exports = {
	events: {
		udp: function ( bot, msg, rinfo ) {
			console.log( msg, rinfo );
			if ( bot.config.yakc && rinfo.address === bot.config.yakc.ip ) {
				bot.fireEvents( 'yakc', msg.toString(), rinfo );
			} else {
				bot.notice( bot.config.udp.channel, msg.toString() );
			}
		}
	}
};

