const chromium = require('chrome-aws-lambda')
const lighthouse = require('lighthouse')

const defaultFlags = [
  '--headless',
  '--disable-dev-shm-usage',
  '--disable-gpu',
  '--no-zygote',
  '--no-sandbox',
  '--hide-scrollbars'
]

module.exports = async function createLighthouse(url, options = {}, config) {
  options.output = options.output || 'html'
  const log = options.logLevel ? require('lighthouse-logger') : null
  if (log) {
    log.setLevel(options.logLevel)
  }
  const chromeFlags = options.chromeFlags || defaultFlags
  return chromium.puppeteer.launch({
    args: chromeFlags,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
    defaultViewport: chromium.defaultViewport,
  })
    .then((chrome) => {
      options.port = new URL(chrome.wsEndpoint()).port
      return {
        chrome,
        log,
        start() {
          return lighthouse(url, options, config)
        }
      }
    })
}