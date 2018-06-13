const path = require('path')
const fs = require('fs')
const createLighthouse = require('.')
const { version } = require('./package.json')

exports.handler = function (event, context, callback) {
  Promise.resolve()
    .then(() => createLighthouse('https://example.com', { logLevel: 'info' }))
    .then(({ chrome, start, createReport }) => {
      return start()
        .then((results) => {
          if (event.saveResults) {
            const filename = results.lighthouseVersion
            fs.writeFileSync(path.join(__dirname, `results/${filename}.json`), `${JSON.stringify(results, null, 2)}\n`)
            fs.writeFileSync(path.join(__dirname, `results/${filename}.html`), createReport(results))
          }
          return chrome.kill().then(() => callback(null, {
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
