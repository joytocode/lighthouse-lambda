const path = require('path')

const binPath = path.join(__dirname, '../bin')

exports.binary = {
  binPath: binPath,
  cachePath: getCachePath(),
  fileName: 'headless-chromium',
  version: '67.0.3396.87',
  checksum: {
    algorithm: 'sha256',
    value: 'bb110d5a309567977ff6f9eab5491a4adeae7aa7bbd94d12fd9a689b89d447c7'
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
