module.exports = {
  commands: {
    units: {
      help: 'Get UK alcohol units from ABV and volume (in ml)',
      aliases: [ 'abv' ],
      usage: [ 'volume', 'abv' ],
      command: function (bot, msg) {
        // convert human units into ml
        var volumes = {
          'shot': 25,
          'double': 50,
          'can': 330,
          'glass': 175,
          'pint': 568,
          'yard': 1420.65
        }
        if (volumes[msg.args.volume]) {
          msg.args.volume = volumes[msg.args.volume]
        }

        // parse into float
        msg.args.volume = parseFloat(msg.args.volume, 10)
        msg.args.abv = parseFloat(msg.args.abv, 10)
        // tell user off if input was bad
        if (isNaN(msg.args.volume) || isNaN(msg.args.abv)) {
          return 'can\'t compute that'
        }

        return msg.args.volume + 'ml at ' + msg.args.abv + '% ABV is ' + msg.args.abv * msg.args.volume / 1000 + ' unit(s)'
      }
    }
  }
}
