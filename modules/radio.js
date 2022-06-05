const moment = require('moment')
const axios = require('axios')
const colors = require('irc').colors

const tv = async (station) => {
  const url = `https://ibl.api.bbci.co.uk/ibl/v1/channels/${station}/broadcasts?per_page=2`

  const { data } = await axios(url)
  const now = data.broadcasts.elements[0]
  const next = data.broadcasts.elements[1]

  const str = [
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
    const paperStart = moment(now.scheduled_start)
    const actualStart = moment(now.transmission_start)
    str.push(colors.wrap('light_red',
      'overrunning by ' + moment.duration(actualStart.diff(paperStart)).humanize()
    ))
  }
  if (!data.broadcasts.channel.on_air) str.push(colors.wrap('light_cyan', 'off-air'))

  return str.join(' ')
}

module.exports = {
  commands: {
    // https://github.com/MikeRalphson/bbcparse/wiki/BBC-Linear-Services-(SIDs)
    tv: {
      help: 'Displays the schedule for an arbitary BBC television channel',
      usage: ['channel'],
      command: async (bot, msg) => tv(msg.args.channel)
    },
    bbc1: {
      aliases: ['bbcone'],
      help: 'Displays the current BBC One schedule',
      command: async (bot, msg) => tv('bbc_one_hd')
    },
    bbc2: {
      aliases: ['bbc2e', 'bbctwo'],
      help: 'Displays the current BBC Two schedule',
      command: async (bot, msg) => tv('bbc_two_england')
    },
    bbc4: {
      aliases: ['bbcfour'],
      help: 'Displays the current BBC Four schedule',
      command: async (bot, msg) => tv('bbc_four')
    },
    bbcparl: {
      aliases: ['bbcp', 'parly'],
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
    }
  }
}
