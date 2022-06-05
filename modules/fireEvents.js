/**
 * Logic to fire events.
 */

function fireEvents () {
  const args = Array.prototype.slice.call(arguments)
  const name = args.shift()

  try { // events can fire mid-reload
    if (!this.events[name]) return
    for (let i = 0; i < this.events[name].length; i++) {
      const cargs = args
      if (cargs[0] !== this) { // getting dupes for some reason
        cargs.unshift(this)
      }
      this.events[name][i].apply(this, cargs)
    }
  } catch (e) {
    this.log('error', 'Error processing ' + name + ' event: ')
    this.log('error', e.stack)
  }
}

module.exports = {
  onload: (bot) => {
    bot.fireEvents = fireEvents
  }
}
