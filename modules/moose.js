module.exports = {
  commands: {
    moose: {
      help: 'A møøse once bit my sister',
      aliases: ['swedish'],
      command: function (bot, msg) {
        return msg.body
          .replace(/\band\b|ith\b/g, 'ik')
          .replace(/\bthe\b/g, 'den')
          .replace(/o/g, 'ø')
          .replace(/h?y\b/g, 'i')
          .replace(/\bC/g, 'K')
          .replace(/\bc/g, 'k')
      }
    }
  }
}
