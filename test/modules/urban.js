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
          let defs = {
            one: 'one two three four',
            two: 'five [six] seven',
            three: 'eight [nine] ten [eleven twelve]'
          }

          if (!headword) return undefined

          /* eslint-disable standard/no-callback-literal */
          return cb({
            definition: defs[headword],
            permalink: 'https://example.com',
            word: headword
          })
          /* eslint-enable standard/no-callback-literal */
        }
      }
    })

    mockBot.loadModule('urban')
  })

  it('should return a definition', async function () {
    let response = await mockBot.runCommand('!ud one')
    assert.strictEqual(response, '\u000308one\u000f: one two three four https://example.com')
  })

  it('should format brackets in definitions', async function () {
    let response = await mockBot.runCommand('!ud two')
    assert.strictEqual(response, '\u000308two\u000f: five \u000300six\u000f seven https://example.com')
  })

  it('should format multiple brackets in definitions', async function () {
    let response = await mockBot.runCommand('!ud three')
    assert.strictEqual(response, '\u000308three\u000f: eight \u000300nine\u000f ten \u000300eleven twelve\u000f https://example.com')
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
