// inspired by xkcd's bucket :)
var inventory = []
var inventoryLimit = 20
var dropRate = 500
var write = require('fs').writeFile

try {
  inventory = require(__rootdir + '/data/inventory.json') || []
} catch (e) {
  //
}

/**
 * Save current inventory to disk
 */
function saveInventory () {
  write(__rootdir + '/data/inventory.json', JSON.stringify(inventory))
}

/**
 * Drop a random item.
 * Returns a string containing the dropped item.
 */
function dropItem () {
  return inventory.splice(Math.floor(Math.random() * inventory.length), 1)
}

/**
 * Adds given item to inventory.
 * Returns dropped item, if any.
 */
function addToInventory (item) {
  if (inventory.push(item) > inventoryLimit) {
    return dropItem()
  }
  return null
}

module.exports = {
  events: {
    action: function (bot, nick, to, text) {
      var synonyms = {
        'adverb': [
          'absentmindedly',
          'agreeably',
          'anxiously',
          'augustly',
          'awkwardly',
          'bitterly',
          'blithely',
          'coyly',
          'deliriously',
          'dramatically',
          'enthusiastically',
          'foolishly',
          'grudgingly',
          'hungrily',
          'imprudently',
          'innocently',
          'lovingly',
          'lucidly',
          'nervously',
          'obediently',
          'passionately',
          'regretfully',
          'reproachfully',
          'tumultuously',
          'vivaciously',

          // in lieu of actually putting a Math.random in:
          '', '', '', '', '', '', '', '', '', '', '', '', '',
          '', '', '', '', '', '', '', '', '', '', '', '', ''
        ],
        'give': [
          'awards',
          'gives',
          'hands',
          'lends',
          'passes',
          'throws'
        ],
        'take': [
          'accepts',
          'grabs',
          'picks up',
          'takes'
        ],
        'discard': [
          'abandons',
          'discards',
          'dispenses with',
          'ditches',
          'drops',
          'dumps',
          'forsakes',
          'jettisons',
          'relinquishes',
          'scraps',
          'sheds',
          'throws away',
          'tosses'
        ]
      }
      var regex = new RegExp('(' + synonyms.give.join('|') + ') ' + bot.nick + ' (.+)')

      var matches = regex.exec(text)

      if (matches) {
        var newItem = matches[2]
        // maybe put this elsewhere?
        if (newItem.substr('\u0003') !== -1) {
          newItem = newItem + '\u000f'
        }
        var oldItem = addToInventory(newItem)

        if (oldItem) {
          bot.action(to, [
            synonyms.adverb[Math.floor(Math.random() * synonyms.discard.length)].trim(),
            synonyms.take[Math.floor(Math.random() * synonyms.take.length)],
            newItem.trim() + ',',
            'and',
            synonyms.adverb[Math.floor(Math.random() * synonyms.adverb.length)].trim(),
            synonyms.discard[Math.floor(Math.random() * synonyms.discard.length)],
            oldItem
          ].join(' ').replace(/\s+/g, ' ').trim())
        } else {
          bot.action(to, [
            synonyms.adverb[Math.floor(Math.random() * synonyms.discard.length)],
            synonyms.take[Math.floor(Math.random() * synonyms.take.length)],
            newItem
          ].join(' ').replace(/\s+/g, ' ').trim()
          )
        }
        saveInventory()
      }
    },
    message: function (bot, nick, to) {
      if (Math.random() < 1 / dropRate) { // 1 in 500
        var item = dropItem()
        if (item) {
          if (Math.random() < 1 / 5) {
            bot.action(to, [
              Math.random() < 0.5 ? 'gives' : 'passes', // TODO: synonyms from above
              nick,
              item
            ].join(' '))
          } else {
            bot.action(to, 'drops ' + item)
          }
        }
      }
    }
  },
  commands: {
    inventory: {
      help: 'Displays the inventory of the bot',
      command: function () {
        if (inventory.length > 0) {
          return 'I\'m holding ' + inventory.join(', and ')
        }
        return 'I\'m holding nowt'
      }
    },
    drop: {
      help: 'Drop an item from inventory',
      disabled: true,
      command: function () {
        var item = dropItem()
        if (item) {
          if (item === 'apple') {
            return 'Core dumped.'
          }
          return 'dropped ' + item
        }
        return 'shan\'t!'
      }
    },
    droprate: {
      help: 'Sets the rate at which the bot drops items',
      usage: [ 'rate' ],
      command: function (bot, msg) {
        var newRate = parseInt(msg.args.rate, 10)
        if (isNaN(newRate) || newRate < 1) {
          return 'Usage: !rate <integer>'
        }
        dropRate = newRate
        return 'Drop rate is now 1 in ' + dropRate
      }
    },
    inventorylimit: {
      help: 'Sets the inventory limit of the bot',
      privileged: true,
      usage: [ 'limit' ],
      command: function (bot, msg) {
        var old = inventoryLimit
        var newLimit = parseInt(msg.args.limit, 10)
        if (typeof newLimit !== 'number') {
          return 'cannae do that cap\'n'
        }
        inventoryLimit = newLimit
        return 'Changed limit from ' + old + ' to ' + inventoryLimit
      }
    }
  }
}
