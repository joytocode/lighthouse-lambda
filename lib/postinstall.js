const path = require('path')
const fs = require('fs')
const download = require('download')
const ProgressBar = require('progress')
const chromeConfig = require('./chromeConfig')
const calculateChecksum = require('./checksum')

postinstall()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })

function postinstall () {
  return checkDownload()
    .then((needToDownload) => {
      if (!needToDownload) {
        console.log(`headless-chrome ${chromeConfig.binary.version} is already downloaded.`)
        return
      }
      console.log(`Downloading headless-chrome ${chromeConfig.binary.version}...`)
      const bar = new ProgressBar('[:bar] :percent :etas', {
        total: 0,
        width: 50,
        complete: '=',
        incomplete: ' '
      })
      const url = `https://s3-us-west-2.amazonaws.com/webok/headless-chrome/${chromeConfig.binary.version}.zip`
      return download(url, path.dirname(chromeConfig.binary.filePath), { extract: true })
        .on('response', (res) => {
          bar.total = res.headers['content-length']
          res.on('data', (data) => bar.tick(data.length))
        })
        .then(verifyBinary)
        .then(({ checksum, matched }) => {
          if (!matched) {
            throw new Error(`Checksum ${checksum} does not matched.`)
          }
        })
    })
}

function checkDownload () {
  if (!fs.existsSync(chromeConfig.binary.filePath)) {
    return Promise.resolve(true)
  }
  return verifyBinary()
    .then(({ matched }) => !matched)
}

function verifyBinary () {
  return calculateChecksum(chromeConfig.binary.filePath, chromeConfig.binary.checksum.algorithm)
    .then((checksum) => {
      return {
        checksum,
        matched: checksum === chromeConfig.binary.checksum.value
      }
    })
}
