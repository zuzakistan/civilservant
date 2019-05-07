const request = require('request-promise')
const moment = require('moment')
const colors = require('irc').colors

const radio = async (station) => {
  const url = `https://polling.bbc.co.uk/modules/onairpanel/include/${station}.json`
  let str
  let data
  try {
    const response = await request.get(url)
    try {
      data = JSON.parse(response)
    } catch (e) {
      if (e instanceof SyntaxError) {
        return response
      }
      throw e
    }
    str = [
      'Now:',
      colors.wrap('white', data.nowTitle),
      colors.wrap('light_gray', data.nowInfo ? '(' + data.nowInfo + ')' : null),
      'followed by',
      data.nextTitle,
      moment(data.nextStart).fromNow(),
      moment(data.nextStart).format('(h:mm a)')
    ]

    if (data.state === 'offair') {
      str = [colors.wrap('gray', 'station is off-air')]
    }
  } catch (e) {
    str = ['err', e]
  }
  return str.join(' ')
}

module.exports = {
  commands: {
    worldservice: {
      help: 'Displays the current BBC World Service schedule',
      command: async (bot, msg) => radio('bbc_world_service')
    },
    r1: {
      help: 'Displays the current BBC Radio 1 schedule',
      command: async (bot, msg) => radio('bbc_radio_one')
    },
    r2: {
      help: 'Displays the current BBC Radio 2 schedule',
      command: async (bot, msg) => radio('bbc_radio_two')
    },
    r3: {
      help: 'Displays the current BBC Radio 3 schedule',
      command: async (bot, msg) => radio('bbc_radio_three')
    },
    r4: {
      help: 'Displays the current BBC Radio 4 schedule',
      command: async (bot, msg) => radio('bbc_radio_fourfm')
    },
    r4lw: {
      help: 'Displays the current BBC Radio 4 long-wave schedule',
      command: async (bot, msg) => radio('bbc_radio_fourlw')
    },
    radio: {
      help: 'Displays the schedule for an arbitary BBC Radio station',
      usage: [ 'station' ],
      command: async (bot, msg) => radio(msg.args.station)
    }
  }
}
