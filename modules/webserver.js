var express = require('express')
var app = express()

app.get('/', function(req, res) {
  res.json({"message":"go away"})
})


app.listen(31337)

module.exports = app
