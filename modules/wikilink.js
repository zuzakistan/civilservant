var bot = require('..');
var fs = require('fs');
var langs = require('languages');
var iw = __dirname + '/interwikis.json';

bot.addListener('message', function(nick,to,text,message){
	var match = text.match(/\[\[.*]\]/);
	if ( match) {
		console.log('1 match');
		match = match[0].substr(2,match[0].length-4);
		var namespace = 'w';
		if ( match.split(':').length !== 1 ) {
			console.log('2 iw');
			match = match.split(':');
			namespace = match.shift();
			match = match.join(':');
		}
		console.log('3 reading');
		fs.readFile(iw,'utf8',function(e,d){
			console.log('4 read');
			if(e){
				console.log(JSON.stringify(e));
				return;}
			console.log('5');
			d = JSON.parse(d);
			console.log('6');
			var str = '';
			match = match.split(']]')[0];
			if(d[namespace]) {
				str = d[namespace].replace("$1",match);
			} else {
				if ( langs.isValid(namespace) ) {
					str = 'https://' + namespace + '.wikipedia.org/wiki/' + match;
				} else {
					str = 'https://en.wikipedia.org/wiki/'+namespace+':'+match;
				}
			}
			bot.say(to,str.replace(/ /g,'_'));
		});
	}
});
