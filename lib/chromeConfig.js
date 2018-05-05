const path = require('path')

const binPath = path.join(__dirname, '../bin')

exports.binary = {
  binPath: binPath,
  cachePath: getCachePath(),
  fileName: 'headless-chromium',
  version: '66.0.3359.117',
  checksum: {
    algorithm: 'sha256',
    value: 'd2f28503a1a96d641a1079a93064752f75abf6ddf1c3750ea44251a16aed6736'
  }
}

function getCachePath () {
  if (process.env.NPM_CONFIG_HEADLESS_CHROME_DIR === 'disabled') {
    return binPath
  }
  return process.env.NPM_CONFIG_HEADLESS_CHROME_DIR || path.join(require('os').tmpdir(), 'headless-chrome')
}

exports.flags = [
  '--disable-gpu',
  '--headless',
  '--no-zygote',
  '--no-sandbox',
  '--single-process'
]
