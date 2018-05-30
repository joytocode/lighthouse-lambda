const path = require('path')
const chromeLauncher = require('chrome-launcher')
const lighthouse = require('lighthouse')
const ReportGenerator = require('lighthouse/lighthouse-core/report/v2/report-generator')
const chromeConfig = require('./chromeConfig')

module.exports = function createLighthouse (url, options = {}, config) {
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
