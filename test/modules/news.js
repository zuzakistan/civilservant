/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')

describe('news module', function () {
  before(function () {
    mockBot.loadModule('news')
  })

  it('should clear the news cache')
  it('should do something cool with news')

  it('should link to the editor feedback', function () {
    assert.strictEqual(mockBot.runCommand('!corrections'), 'https://www.bbc.co.uk/contact/questions/getting-in-touch/report-news-fault')
  })
})
