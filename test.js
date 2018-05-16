const createLighthouse = require('.')

exports.handler = function (event, context, callback) {
  Promise.resolve()
    .then(() => createLighthouse('https://example.com', { logLevel: 'info' }))
    .then(({ chrome, start, createReport }) => {
      return start()
        .then((results) => {
          console.log(createReport(results))
          console.log({
            userAgent: results.userAgent,
            lighthouseVersion: results.lighthouseVersion,
            score: results.score,
            timing: results.timing
          })
          return chrome.kill().then(() => callback(results.userAgent))
        })
    })
    .catch(callback)
}
