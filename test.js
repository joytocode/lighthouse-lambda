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
            fs.writeFileSync(path.join(__dirname, `results/${version}.json`), `${JSON.stringify(results, null, 2)}\n`)
            fs.writeFileSync(path.join(__dirname, `results/${version}.html`), createReport(results))
          }
          return chrome.kill().then(() => callback(null, results.userAgent))
        })
        .catch((error) => {
          return chrome.kill().then(() => callback(error))
        })
    })
    .catch(callback)
}
