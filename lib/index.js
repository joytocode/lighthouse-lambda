const chromePath = require.resolve('@serverless-chrome/lambda/dist/headless-chromium')
const chromeLauncher = require('chrome-launcher')
const lighthouse = require('lighthouse')

const defaultFlags = [
  '--headless',
  '--disable-dev-shm-usage',
  '--disable-gpu',
  '--no-zygote',
  '--no-sandbox',
  '--single-process',
  '--hide-scrollbars'
]

module.exports = function createLighthouse (url, options = {}, config) {
  options.output = options.output || 'html'
  const log = options.logLevel ? require('lighthouse-logger') : null
  if (log) {
    log.setLevel(options.logLevel)
  }
  const chromeFlags = options.chromeFlags || defaultFlags
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
