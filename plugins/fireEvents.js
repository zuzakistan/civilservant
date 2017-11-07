/**
 * Logic to fire events.
 */

var bot = require('..') // TODO

bot.fireEvents = function () {
  var args = Array.prototype.slice.call(arguments)
  var name = args.shift()

  try { // events can fire mid-reload
    if (bot.events[name]) {
      for (var i = 0; i < bot.events[name].length; i++) {
        var cargs = args
        if (cargs[0] !== bot) { // getting dupes for some reason
          cargs.unshift(bot)
        }
        bot.events[name][i].apply(this, cargs)
      }
    }
  } catch (e) {
    console.error('Error processing ' + name + ' event: ')
    console.error(e.stack)
  }
}
