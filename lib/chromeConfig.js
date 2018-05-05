const path = require('path')

const binPath = path.join(__dirname, '../bin')

exports.binary = {
  binPath: binPath,
  cachePath: getCachePath(),
  fileName: 'headless-chromium',
  version: '66.0.3359.139',
  checksum: {
    algorithm: 'sha256',
    value: 'a888430efb711c3d32fdb402130065f92e8d8426242dab77e8ebecd79f215e3b'
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
