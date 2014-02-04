var client = require('..');
var schedule = require("node-schedule");
var request = require("request");
var _ = require("underscore");
var Bitly = require('bitly');

var stale = [];

var bitly = new Bitly(client.config.bitly.username, client.config.bitly.password);

var pulserule= new schedule.RecurrenceRule();
pulserule.second = [0,30];
var firstrun = true;

var pulse = schedule.scheduleJob(pulserule, function(){
    request("http://www.bbc.co.uk/news/10284448/ticker.sjson", function(err, res, body){
        if(err){
            console.log(err.message);
        } else {
            var data = JSON.parse(body);
            data.entries.forEach(function(item){
                if(!_.contains(stale,item.url)){
                    stale.push(item.url);
                    var msg = "";
                    if(item.isbreaking){
                        msg += "\u00035";
                        msg += item.prompt;
                        msg += ": ";
                    } else {
                        var len = item.prompt.length;
                        var color = "\u0003";
                        color += (parseInt(len,16)%15);
                        msg += color + item.prompt + ": ";
                        msg += "\u0003";
                    }
                    msg += item.headline;
                    bitly.shorten(item.url, function(err, response){
                        if(err){
                          throw err;
                        } else if (response.data.url !== undefined) {
                          msg += " " + response.data.url;
                        } else {
                          msg += " \u000314<article pending>";
                        }
                        //if (item.isBreaking == "true") {
                        client.config.irc.channels.forEach(function(chan) {
                          client.notice(chan, msg);
                        });
                    });
                }
            });
        }
    });
});
