var request = require("request");
var bot = require('..');
var figsrcurl = "https://gsi.zuzakistan.com/w/api.php?action=parse&page=template:Stockpile&format=json"
 
levels = {
  'emergency': 5,
  'warning': 10,
  'plenty': 30,
}
messages = {
  'depleted': "Martial Law has been declared.",
  'emergency': "A state of emergency has been declared.",
  'warning': "Citizens are advised: fig roll supplies are low",
  'normal': "Fig Roll supplies are addequate",
  'plenty': "Fig Roll supplies are plentiful"
};
 
function figrequest(bot, to) {
  request(figsrcurl, function(err, res, body){
    if(err){
      console.log(err.message);
    } else {
      try {
        var data = JSON.parse(body);
      } catch (e) {
        console.log(e);
        return
      }
      if(! data.parse) {
        console.log(body);
        return;
      }
      if(! data.parse.text) return;
      if(! data.parse.text['*']) return;
      var supply = parseInt(data.parse.text['*'].match(/(\d+)/)[0]);
      message = messages['plenty'];
      if(supply < levels['plenty']) {
        message = messages['normal'];
      }
      if(supply <= levels['warning']) {
        message = messages['warning'];
      }
      if(supply <= levels['emergency']) {
        message = messages['emergency'];
      }
      if(supply == 0) {
        message = messages['depleted'];
      }
      message = message + ". ("+supply+" fig rolls)";
      if(bot) {
        bot.say(to, message);
      }
      else {
        console.log(message);
      }
    }
  });
}
 
if(bot) {
  bot.addListener('message', function (nick,to,text,message) {
    var args = text.split(' ');
    if (args[0] == "!figs" ) {
      figrequest(bot, to);
    }
  });
}
