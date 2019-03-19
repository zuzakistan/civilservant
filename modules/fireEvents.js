/**
 * Logic to fire events.
 */

function fireEvents () {
  var args = Array.prototype.slice.call(arguments)
  var name = args.shift()

  try { // events can fire mid-reload
    if (!this.events[name]) return
    for (var i = 0; i < this.events[name].length; i++) {
      var cargs = args
      if (cargs[0] !== this) { // getting dupes for some reason
        cargs.unshift(this)
      }
      this.events[name][i].apply(this, cargs)
    }
  } catch (e) {
    console.error('Error processing ' + name + ' event: ')
    console.error(e.stack)
  }
}

module.exports = {
  onload: (bot) => {
    bot.fireEvents = fireEvents
  }
}
