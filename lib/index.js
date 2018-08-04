const chromePath = require.resolve('@serverless-chrome/lambda/dist/headless-chromium')
const chromeLauncher = require('chrome-launcher')
const lighthouse = require('lighthouse')
const ReportGenerator = require('lighthouse/lighthouse-core/report/v2/report-generator')

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
        createReport,
        start ({ saveArtifacts = false } = {}) {
          return lighthouse(url, options, config)
            .then((results) => {
              if (!saveArtifacts) {
                delete results.artifacts
              }
              return results
            })
        }
      }
    })
}

function createReport (results) {
  return new ReportGenerator().generateReportHtml(results)
}
