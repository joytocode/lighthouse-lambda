const path = require('path')

const binPath = path.join(__dirname, '../bin')

exports.binary = {
  binPath: binPath,
  cachePath: getCachePath(),
  fileName: 'headless-chromium',
  version: '67.0.3396.99',
  checksum: {
    algorithm: 'sha256',
    value: 'f170bf336cbc56bcbf5eb6c2be5caa376ea009e9d9990897ccc9b97a5d3fd694'
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
