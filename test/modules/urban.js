/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')
const mockery = require('mockery')

describe('urban module', function () {
  before(function () {
    // mockery mocks the entire require()
    mockery.enable()
    mockery.registerMock('urban', (headword) => {
      return {
        first: (cb) => {
          const defs = {
            one: 'one two three four',
            two: 'five [six] seven',
            three: 'eight [nine] ten [eleven twelve]',
            four: 'thirteen fourteen'
          }

          if (!headword) return undefined

          /* eslint-disable node/no-callback-literal */
          return cb({
            definition: defs[headword],
            permalink: 'https://example.com',
            written_on: '2019-10-08T11:47:22.198Z',
            word: headword === 'four' ? 'for' : headword
          })
          /* eslint-enable node/no-callback-literal */
        }
      }
    })

    mockBot.loadModule('urban')
  })

  it('should return a definition', async function () {
    const response = await mockBot.runCommand('!ud one')
    assert.strictEqual(response, '\u000307one\u000f (2019): one two three four \u000314https://example.com\u000f')
  })

  it('should format brackets in definitions', async function () {
    const response = await mockBot.runCommand('!ud two')
    assert.strictEqual(response, '\u000307two\u000f (2019): five \u000300six\u000f seven \u000314https://example.com\u000f')
  })

  it('should format multiple brackets in definitions', async function () {
    const response = await mockBot.runCommand('!ud three')
    assert.strictEqual(response, '\u000307three\u000f (2019): eight \u000300nine\u000f ten \u000300eleven twelve\u000f \u000314https://example.com\u000f')
  })

  it('should be a different colour when not an exact match', async function () {
    const response = await mockBot.runCommand('!ud four')
    assert.strictEqual(response, '\u000308for\u000f (2019): thirteen fourteen \u000314https://example.com\u000f')
  })

  it('should reject on 404', function () {
    assert.rejects(mockBot.runCommand('!ud zero'))
  })

  after(function (done) {
    mockery.disable()
    mockery.deregisterAll()
    done()
  })
})
