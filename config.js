const convict = require('convict')

let config

module.exports = config = convict({
  irc: {
    /* Most of these are taken from the node-irc module */
    server: {
      doc: 'the IRC server to connect to',
      format: String,
      default: 'chat.freenode.net',
      env: 'IRC_SERVER'
    },
    debug: {
      doc: 'Whether to enable debug messages from the node-irc library',
      format: Boolean,
      default: true
    },
    retryCount: {
      doc: 'Number of times to try reconnecting if disconnected',
      format: 'nat',
      default: 0,
      env: 'IRC_RETRY'
    },
    port: {
      doc: 'the port to connect to the IRC server on',
      format: 'port',
      default: 6667,
      env: 'IRC_PORT'
    },
    sasl: {
      doc: 'Whether to use the Simple Authentication and Security Layer to connect',
      format: Boolean,
      default: false,
      env: 'SASL'
    },
    nick: {
      doc: 'The IRC nickname to try to use first',
      format: String,
      default: 'civilservant-' + Math.round(Math.random() * 100),
      env: 'IRC_NICK'
    },
    realName: {
      doc: 'The string that appears in whois; ideally something that identifies the operator (you)',
      format: String,
      default: 'https://github.com/zuzakistan/civilservant',
      env: 'IRC_REALNAME'
    },
    userName: {
      doc: 'The bit that appears before the @ in the host string',
      format: String,
      env: 'IRC_USERNAME',
      default: 'cs'
    },
    password: {
      doc: 'The password used to connect to IRC',
      format: String,
      env: 'IRC_PASSWORD',
      default: null
    },
    channels: {
      doc: 'the channels to connect to',
      format: Array,
      default: [ '##zuzakistan-lab' ]
    },
    control: {
      doc: 'The channel that one is allowed to make privileged commands from',
      format: String,
      default: '##zuzakistan-lab',
      env: 'CONTROL_CHAN'
    },
    secure: {
      doc: 'Whether to connect to IRC via SSL',
      format: Boolean,
      env: 'IRC_SECURE',
      default: false
    },
    insecure: {
      doc: 'Whether to disable the concept of a control channel',
      format: Boolean,
      default: false,
      env: 'INSECURE'
    },
    controlChar: {
      doc: 'the prefix before any bot commands',
      format: String,
      default: '!',
      env: 'CONTROL_CHAR'
    },
    quiet: {
      doc: 'whether the bot should suppress unsolicited messages',
      format: Boolean,
      default: false,
      env: 'QUIET'
    }
  },
  irclogs: {
    doc: 'IRC log location',
    format: String
  },
  news: {
    poll: {
      doc: 'Whether to automatically poll for news',
      format: Boolean,
      default: true
    },
    replace: {
      doc: 'Whether to enable xkcd style substitutions',
      format: Boolean,
      default: true
    },
    loud: {
      doc: 'Whether to allow more noisy news feeds',
      format: Boolean,
      default: false
    },
    owo: {
      doc: 'Whether to enable cursed furry transformation on headlines',
      format: Boolean,
      default: false
    }
  },
  bitly: {
    username: {
      doc: 'Bit.ly username for URL shortening',
      format: String
    },
    password: {
      doc: 'Bit.ly password for URL shortening',
      format: String
    }
  },
  youtube: {
    key: {
      doc: 'YouTube API key',
      format: String
    }
  },
  verbose: {
    doc: 'whether to log raw IRC events to console',
    format: Boolean,
    default: false
  },
  udp: {
    port: {
      doc: 'UDP port to listen for things to repeat',
      format: 'port'
    },
    channel: {
      doc: 'IRC channel to parrot UDP messages to',
      default: '##zuzakistan-lab'
    }
  },
  minecraft: {
    map: {
      doc: 'URL to Minecraft server map interface',
      format: 'url'
    }
  },
  allowReload: {
    doc: 'Whether to allow the !reload command',
    format: Boolean,
    default: true
  },
  yakc: {
    ip: {
      doc: 'IP address to allow yakc input from',
      format: 'ip'
    },
    channel: {
      doc: 'Channel to output github.com/zuzak/yakc messages to',
      format: String
    }
  }
})

try {
  config.loadFile((process.env.NODE_ENV || 'config') + '.json')
} catch (e) {
  console.error('Not loading configuration from file')
}
