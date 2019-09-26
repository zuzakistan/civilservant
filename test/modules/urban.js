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
        first: () => {
          switch (headword) {
            case 'one':
              return { definition: 'one two three four', link: 'http://example.com' }
            default:
              return undefined
          }
        }
      }
    })

    mockBot.loadModule('urban')
  })

  it('should return a definition', async function () {
    let response = await mockBot.runCommand('!ud one')
    assert.strictEqual(response, 'one two three four')
  })

  it('should show an error on 404', async function () {
    let response = await mockBot.runCommand('!ud two')
    assert.strictEqual(response, 'unable to find a definition for two')
  })

  after(function (done) {
    mockery.disable()
    mockery.deregisterAll()
    done()
  })
})
