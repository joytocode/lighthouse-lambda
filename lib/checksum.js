const crypto = require('crypto')
const fs = require('fs')

module.exports = function calculateChecksum (filePath, algorithm) {
  return new Promise((resolve, reject) => {
    try {
      const hash = crypto.createHash(algorithm)
      const stream = fs.createReadStream(filePath)
      stream.on('data', (data) => hash.update(data))
      stream.on('end', () => resolve(hash.digest('hex')))
      stream.on('error', reject)
    } catch (err) {
      reject(err)
    }
  })
}
