const path = require('path')
const fs = require('fs')
const createLighthouse = require('.')

exports.handler = function (event, context, callback) {
  Promise.resolve()
    .then(() => createLighthouse(event.url || 'https://example.com', { logLevel: 'info' }))
    .then(({ chrome, start, createReport }) => {
      return start()
        .then((results) => {
          if (event.saveResults) {
            const filename = results.lighthouseVersion.split('-')[0]
            fs.writeFileSync(path.join(__dirname, `results/${filename}.json`), `${JSON.stringify(results, null, 2)}\n`)
            fs.writeFileSync(path.join(__dirname, `results/${filename}.html`), createReport(results))
          }
          return chrome.kill().then(() => callback(null, {
            url: results.initialUrl,
            timing: results.timing,
            userAgent: results.userAgent,
            lighthouseVersion: results.lighthouseVersion
          }))
        })
        .catch((error) => {
          return chrome.kill().then(() => callback(error))
        })
    })
    .catch(callback)
}
