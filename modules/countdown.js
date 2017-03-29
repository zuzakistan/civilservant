var moment = require( 'moment' );
module.exports = {
	commands: {
		a50: {
			help: 'Gets the time until the UK Article 50 procedure expires',
			command: function () {
				return 'Article will expire ' + moment([2017 + 2, 03, 29, 11, 27, 38]).fromNow();
			}
		}
	}
};
