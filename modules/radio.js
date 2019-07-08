const request = require('request-promise')
const moment = require('moment')
const colors = require('irc').colors

const tv = async (station) => {
  const url = `https://ibl.api.bbci.co.uk/ibl/v1/channels/${station}/broadcasts?per_page=2`
  let data
  let str
  const response = await request.get(url)
  try {
    data = JSON.parse(response)
  } catch (e) {
    if (e instanceof SyntaxError) {
      return response
    }
    throw e
  }

  const now = data.broadcasts.elements[0]
  const next = data.broadcasts.elements[1]

  str = [
    now.episode.live ? 'Live' : 'Now',
    'on',
    data.broadcasts.channel.title + ':',
    colors.wrap(now.episode.master_brand.id === 'bbc_sport' ? 'yellow' : 'white', now.episode.title),
    now.episode.subtitle ? colors.wrap('light_gray', '(' + now.episode.subtitle + ')') : null,
    colors.wrap('gray', ((ep) => {
      return [
        ep.signed ? 'S' : null,
        ep.guidance ? 'G' : null,
        ep.audio_described ? 'AD' : null,
        now.repeat ? 'R' : null
      ].filter(x => x != null).join(' ')
    })(now.episode)),
    'followed by',
    next.repeat ? 'a repeat of' : null,
    next.episode.title,
    moment(next.scheduled_start).fromNow(),
    moment(next.scheduled_start).format('(h:mm a)')
  ].filter(x => x != null)

  if (now.transmission_start && now.scheduled_start !== now.transmission_start) {
    let paperStart = moment(now.scheduled_start)
    let actualStart = moment(now.transmission_start)
    str.push(colors.wrap('light_red',
      'overrunning by ' + moment.duration(actualStart.diff(paperStart)).humanize()
    ))
  }
  if (!data.broadcasts.channel.on_air) str.push(colors.wrap('light_cyan', 'off-air'))

  return str.join(' ')
}

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
    // https://github.com/MikeRalphson/bbcparse/wiki/BBC-Linear-Services-(SIDs)
    tv: {
      help: 'Displays the schedule for an arbitary BBC television channel',
      usage: [ 'channel' ],
      command: async (bot, msg) => tv(msg.args.channel)
    },
    bbc1: {
      aliases: [ 'bbcone' ],
      help: 'Displays the current BBC One schedule',
      command: async (bot, msg) => tv('bbc_one_hd')
    },
    bbc2: {
      aliases: [ 'bbc2e', 'bbctwo' ],
      help: 'Displays the current BBC Two schedule',
      command: async (bot, msg) => tv('bbc_two_england')
    },
    bbc4: {
      aliases: [ 'bbcfour' ],
      help: 'Displays the current BBC Four schedule',
      command: async (bot, msg) => tv('bbc_four')
    },
    bbcparl: {
      aliases: [ 'bbcp', 'parly' ],
      help: 'Displays the current BBC Parliament schedule',
      command: async (bot, msg) => tv('bbc_parliament')
    },
    cbbc: {
      help: 'Displays what\'s on CBBC right now',
      command: async (bot, msg) => tv('cbbc')
    },
    cbeebies: {
      help: 'Displays what\'s on CBeebies right now',
      command: async (bot, msg) => tv('cbeebies')
    },
    bbcn: {
      help: 'Displays what\'s on the BBC News channel right now',
      command: async (bot, msg) => tv('bbc_news24')
    },
    radio: {
      help: 'Displays the schedule for an arbitary BBC Radio station',
      usage: [ 'station' ],
      command: async (bot, msg) => radio(msg.args.station)
    },
    worldservice: {
      help: 'Displays the current BBC World Service schedule',
      command: async (bot, msg) => radio('bbc_world_service')
    },
    r1: {
      help: 'Displays the current BBC Radio 1 schedule',
      command: async (bot, msg) => radio('bbc_radio_one')
    },
    r1x: {
      help: 'Displays the current BBC 1Xtra schedule',
      command: async (bot, msg) => radio('bbc_1xtra')
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
    r4x: {
      help: 'Displays the current BBC Radio 4 Extra schedule',
      command: async (bot, msg) => radio('bbc_radio_four_extra')
    },
    r5: {
      help: 'Displays the current BBC Radio 5 Live schedule',
      command: async (bot, msg) => radio('bbc_radio_five_live')
    },
    r5x: {
      help: 'Displays the current BBC Radio 5 Live Sports Extra schedule',
      command: async (bot, msg) => radio('bbc_radio_five_live_sports_extra')
    },
    r6: {
      help: 'Displays the current BBC 6 Music schedule',
      command: async (bot, msg) => radio('bbc_6music')
    },
    ran: {
      help: 'Displays the current BBC Asian Network schedule',
      command: async (bot, msg) => radio('bbc_asian_network')
    },
    rscotland: {
      help: 'Displays the current BBC Radio Scotland schedule',
      command: async (bot, msg) => radio('bbc_radio_scotland_fm')
    },
    rnangaidheal: {
      help: 'Displays the current BBC Radio nan Gàidheal schedule',
      command: async (bot, msg) => radio('bbc_radio_nan_gaidheal')
    },
    rulster: {
      help: 'Displays the current BBC Radio Ulster schedule',
      command: async (bot, msg) => radio('bbc_radio_ulster')
    },
    rfoyle: {
      help: 'Displays the current BBC Radio Foyle schedule',
      command: async (bot, msg) => radio('bbc_radio_foyle')
    },
    rwales: {
      help: 'Displays the current BBC Radio Wales schedule',
      command: async (bot, msg) => radio('bbc_radio_wales_fm')
    },
    rcymru: {
      help: 'Displays the current BBC Radio Cymru schedule',
      command: async (bot, msg) => radio('bbc_radio_cymru')
    },
    rcymru2: {
      help: 'Displays the current BBC Radio Cymru schedule',
      command: async (bot, msg) => radio('bbc_radio_cymru_2')
    }
  }
}
