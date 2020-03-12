const chromium = require('chrome-aws-lambda')
const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher');

const defaultFlags = [
  '--headless',
  '--disable-dev-shm-usage',
  '--disable-gpu',
  '--no-zygote',
  '--no-sandbox',
  '--hide-scrollbars',
  '--single-process'
]

chromePath = undefined;

if (['AWS_Lambda_nodejs10.x', 'AWS_Lambda_nodejs12.x'].includes(process.env.AWS_EXECUTION_ENV) === true) {
  if (process.env.FONTCONFIG_PATH === undefined) {
    process.env.FONTCONFIG_PATH = '/tmp/aws';

  }

  if (process.env.LD_LIBRARY_PATH === undefined) {
    process.env.LD_LIBRARY_PATH = '/tmp/aws/lib';
  } else if (process.env.LD_LIBRARY_PATH.startsWith('/tmp/aws/lib') !== true) {
    process.env.LD_LIBRARY_PATH = [...new Set(['/tmp/aws/lib', ...process.env.LD_LIBRARY_PATH.split(':')])].join(':');
  }
}

module.exports = async function createLighthouse(url, options = {}, config) {
  options.output = options.output || 'html'
  const log = options.logLevel ? require('lighthouse-logger') : null
  if (log) {
    log.setLevel(options.logLevel)
  }
  const chromeFlags = options.chromeFlags || defaultFlags
  if (!chromePath) { chromePath = await chromium.executablePath }
  let chrome = await chromeLauncher.launch({
    chromeFlags, chromePath
  });
  options.port = chrome.port
  const results = await lighthouse(url, options, config)
  return {
    chrome,
    log,
    results

  }
}