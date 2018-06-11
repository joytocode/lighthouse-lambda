const path = require('path')
const chromeLauncher = require('chrome-launcher')
const lighthouse = require('lighthouse')
const chromeConfig = require('./chromeConfig')

module.exports = function createLighthouse (url, options = {}, config) {
  options.output = options.output || 'html'
  const log = options.logLevel ? require('lighthouse-logger') : null
  if (log) {
    log.setLevel(options.logLevel)
  }
  const chromeFlags = chromeConfig.flags.concat(options.chromeFlags || [])
  const chromePath = path.join(chromeConfig.binary.binPath, chromeConfig.binary.fileName)
  return chromeLauncher.launch({ chromeFlags, chromePath })
    .then((chrome) => {
      options.port = chrome.port
      return {
        chrome,
        log,
        start () {
          return lighthouse(url, options, config)
        }
      }
    })
}
