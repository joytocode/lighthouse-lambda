const path = require('path')

const binPath = path.join(__dirname, '../bin')

exports.binary = {
  binPath: binPath,
  cachePath: getCachePath(),
  fileName: 'headless-chromium',
  version: '68.0.3440.84',
  checksum: {
    algorithm: 'sha256',
    value: 'eba9580eb5fa97cd7bcb67031eb9fc23888e83484d0da321a204035b8499d592'
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
