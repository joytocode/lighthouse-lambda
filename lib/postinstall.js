const path = require('path')
const fs = require('fs')
const download = require('download')
const ProgressBar = require('progress')
const mkdirp = require('mkdirp')
const ncp = require('ncp').ncp
const chromeConfig = require('./chromeConfig')
const calculateChecksum = require('./checksum')

const hasCache = chromeConfig.binary.binPath !== chromeConfig.binary.cachePath

postinstall()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })

function postinstall () {
  return checkDownload(chromeConfig.binary.binPath)
    .then((needInBin) => {
      if (!needInBin) {
        console.log(`headless-chrome ${chromeConfig.binary.version} is already downloaded.`)
        return hasCache ? copyBinary(chromeConfig.binary.binPath, chromeConfig.binary.cachePath) : null
      }
      if (hasCache) {
        return checkDownload(chromeConfig.binary.cachePath)
          .then((needInCache) => {
            if (!needInCache) {
              console.log(`headless-chrome ${chromeConfig.binary.version} is already downloaded.`)
              return copyBinary(chromeConfig.binary.cachePath, chromeConfig.binary.binPath)
            }
            return downloadBinary()
              .then(() => copyBinary(chromeConfig.binary.binPath, chromeConfig.binary.cachePath))
          })
      }
      return downloadBinary()
    })
}

function checkDownload (dirPath) {
  const filePath = path.join(dirPath, chromeConfig.binary.fileName)
  if (!fs.existsSync(filePath)) {
    return Promise.resolve(true)
  }
  return verifyBinary(filePath)
    .then(({ matched }) => !matched)
}

function verifyBinary (filePath) {
  return calculateChecksum(filePath, chromeConfig.binary.checksum.algorithm)
    .then((checksum) => {
      return {
        checksum,
        matched: checksum === chromeConfig.binary.checksum.value
      }
    })
}

function copyBinary (fromDir, toDir) {
  return new Promise((resolve, reject) => {
    mkdirp(toDir, (mkdirErr) => {
      if (mkdirErr) {
        reject(mkdirErr)
        return
      }
      ncp(path.join(fromDir, chromeConfig.binary.fileName), path.join(toDir, chromeConfig.binary.fileName), (ncpErr) => {
        if (ncpErr) {
          reject(ncpErr)
          return
        }
        resolve()
      })
    })
  })
}

function downloadBinary () {
  console.log(`Downloading headless-chrome ${chromeConfig.binary.version}...`)
  const bar = new ProgressBar('[:bar] :percent :etas', {
    total: 0,
    width: 50,
    complete: '=',
    incomplete: ' '
  })
  const url = `https://s3-us-west-2.amazonaws.com/joytocode-public/headless-chrome/${chromeConfig.binary.version}.zip`
  return download(url, chromeConfig.binary.binPath, { extract: true })
    .on('response', (res) => {
      bar.total = res.headers['content-length']
      res.on('data', (data) => bar.tick(data.length))
    })
    .then(() => verifyBinary(path.join(chromeConfig.binary.binPath, chromeConfig.binary.fileName)))
    .then(({ checksum, matched }) => {
      if (!matched) {
        throw new Error(`Checksum ${checksum} does not matched.`)
      }
    })
}
