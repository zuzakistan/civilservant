/**
 * Applies a Welsh soft mutation to a given string.
 */
module.exports = {
  commands: {
    rfc: {
      help: 'Links to specified RFC',
      usage: [ 'rfc' ],
      command: function (bot, msg) {
        return 'https://tools.ietf.org/html/rfc' + msg.args.rfc
      }
    }
  }
}
