const createLighthouse = require('.')

exports.handler = function (event, context, callback) {
  Promise.resolve()
    .then(() => createLighthouse('https://example.com', { logLevel: 'info' }))
    .then(({ chrome, start }) => {
      return start()
        .then((results) => {
          console.log({
            userAgent: results.userAgent,
            lighthouseVersion: results.lighthouseVersion,
            score: results.score,
            timing: results.timing
          })
          return chrome.kill().then(() => callback(null))
        })
    })
    .catch(callback)
}
