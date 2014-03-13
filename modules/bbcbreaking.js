var client = require('..');
var schedule = require("node-schedule");
var request = require("request");
var _ = require("underscore");
var Bitly = require('bitly');

var stale = [];

var bitly = new Bitly(client.config.bitly.username, client.config.bitly.password);

var pulserule= new schedule.RecurrenceRule();
pulserule.second = [0,30];
var nox = true;

var pulse = schedule.scheduleJob(pulserule, function(){
    request("http://www.bbc.co.uk/news/10284448/ticker.sjson", function(err, res, body){
        if(err){
            console.log(err.message);
        } else {
          try {
            var data = JSON.parse(body);
          } catch (e) {
            return
          }
            data.entries.forEach(function(item){
                //if(!_.contains(stale,item.url)){
                //    stale.push(item.url);
                if(!_.contains(stale,item.headline+'%'+item.url)){
                    stale.push(item.headline+"%"+item.url)
                    var msg = "";
                    if(item.isbreaking){
                        msg += "\u00035";
                        msg += item.prompt;
                        msg += ":";
                    } else {
                        var len = item.prompt.length;
                        var color = "\u0003";
                        color += (parseInt(len,16)%15);
                        msg += color + item.prompt + ":";
                        msg += " \u0003 ";
                    }
                    msg += item.headline;
                    bitly.shorten(item.url, function(err, response){
                        if(err){
                          throw err;
                        } else if (response.data.url !== undefined) {
                          msg += " " + response.data.url;
                        } else {
                          msg += " \u00031<" + articlePending().join(' ') + ">";
                        }
                        //if (item.isBreaking == "true") {
                        client.config.irc.channels.forEach(function(chan) {
                          if(!nox) {
                            client.notice(chan, msg);
                          }
                        });
                    });
                }
            });
        }
    });
});

client.addListener('message', function(nick,to,text,message){
  if(text == "!news"){
    if (nox == false){
      nox = true
      client.say(to, nick + ": BBC News feed silenced.")
    } else {
      nox = false;
      client.say(to, nick + ": BBC News feed started.")
    }
  }
})

function articlePending() {
  var article = [
    "article",
    "column",
    "details",
    "feature",
    "news",
    "page",
    "report"
  ]
  var pending = [
    "coming",
    "in abeyance",
    "in progress",
    "not yet available",
    "pending",
    "unfinished",
    "unpublished",
    "waiting"
  ]
  return [
     article[Math.floor(Math.random() * article.length)],
     pending[Math.floor(Math.random() * pending.length)]
    ]
}
