var fs = require('fs')
var count
try {
  count = require(__rootdir + '/data/count.json')
} catch (e) {
  count = {}
}
module.exports = {
  commands: {
    increment: {
      aliases: ['count', '++'],
      help: 'Increments a number.',
      command: function (bot, msg) {
        var counter = msg.args.splice(1)
        if (counter === []) {
          counter = ' ' // impossible to send ' ' as argument
        } else {
          counter = counter.join(' ')
        }
        if (!Object.prototype.hasOwnProperty.call(count, counter)) {
          count[counter] = 1
        } else {
          count[counter]++
        }
        fs.writeFile(__rootdir + '/data/count.json', JSON.stringify(count, null, 4))
        if (counter === '') { // reuse :(
          return String(count[counter])
        }
        return counter + ' is now\u0003' + (count[counter] % 16) + ' ' + count[counter]
      }
    }
  }
}
