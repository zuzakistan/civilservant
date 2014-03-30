var bot = require('..');
var web = require('./webserver')
var activity = {}

bot.addListener('message', function (nick, to, text, message) {
  var now = new Date()
  activity[to] = {nick:nick,message:text,time:now.getTime()}
})


web.get('/activity.json', function(req,res){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.json(activity);
})
