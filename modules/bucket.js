// inspired by xkcd's bucket :)
var inventory = { old: [], current: [] }
var inventoryLimit = 20
var dropRate = 500
var write = require('fs').writeFileSync

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
  let item = inventory.current.splice(Math.floor(Math.random() * inventory.length), 1)
  if (item.length > 0) {
    item = item[0]
    inventory.old.push(item)
  }
  saveInventory()
  return item
}

/**
 * Adds given item to inventory.
 * Returns dropped item, if any.
 */
function addToInventory (item, nick) {
  const representation = { item, nick }
  let droppedItem = null
  if (inventory.current.push(representation) > inventoryLimit) {
    droppedItem = dropItem()
  }
  saveInventory()
  return droppedItem
}

module.exports = {
  onload: (bot) => {
    try {
      inventory = require(__rootdir + '/data/inventory.json')
      bot.log('debug', 'Loaded bucket inventory')
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND') throw e
      bot.log('warn', 'Bucket inventory non-existent; creating')
    }
  },
  events: {
    action: function (bot, nick, to, text) {
      var synonyms = {
        adverb: [
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
        give: [
          'awards',
          'gives',
          'hands',
          'lends',
          'passes',
          'throws'
        ],
        take: [
          'accepts',
          'grabs',
          'picks up',
          'takes'
        ],
        discard: [
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
        if (newItem.includes('\u0003')) {
          newItem = newItem + '\u000f'
        }
        var oldItem = addToInventory(newItem, nick)

        if (oldItem) {
          bot.action(to, [
            synonyms.adverb[Math.floor(Math.random() * synonyms.discard.length)].trim(),
            synonyms.take[Math.floor(Math.random() * synonyms.take.length)],
            newItem.trim() + ',',
            'and',
            synonyms.adverb[Math.floor(Math.random() * synonyms.adverb.length)].trim(),
            synonyms.discard[Math.floor(Math.random() * synonyms.discard.length)],
            oldItem.item
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
      if (inventory.current.length < 1) return undefined
      if (Math.random() < 1 / dropRate) { // 1 in 500
        var item = dropItem()
        if (item) {
          if (Math.random() < 1 / 5) {
            bot.action(to, [
              Math.random() < 0.5 ? 'gives' : 'passes', // TODO: synonyms from above
              nick,
              item.item
            ].join(' '))
          } else {
            bot.action(to, 'drops ' + item.item)
          }
        }
      }
    }
  },
  commands: {
    inventory: {
      help: 'Displays the inventory of the bot',
      command: function () {
        if (inventory.current.length !== 0) {
          return 'I\'m holding ' + inventory.current.map((x) => x.item).join(', and ')
        }
        return 'I\'m holding nowt'
      }
    },
    drop: {
      help: 'Drop an item from inventory',
      command: function () {
        var item = dropItem()
        if (item) {
          if (item === 'apple') {
            return 'Core dumped.'
          }
          return 'dropped ' + item.item
        }
        return 'shan\'t!'
      }
    },
    droprate: {
      help: 'Sets the rate at which the bot drops items',
      usage: ['rate'],
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
      usage: ['limit'],
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
