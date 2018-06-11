# joytocode/lighthouse-lambda
Run [Google Chrome Lighthouse](https://github.com/GoogleChrome/lighthouse) on [AWS Lambda](https://aws.amazon.com/lambda/).

## Versions
Since 2.x, `lighthouse-lambda` has the same major version of [lighthouse](https://www.npmjs.com/package/lighthouse). For example, `lighthouse-lambda` 2.x will use `lighthouse` 2.x.

This README is for version 2.x. To see version 3.x, visit https://github.com/joytocode/lighthouse-lambda/tree/v3.

## Installation

```bash
$ npm install lighthouse-lambda --save
```

The postinstall script of `lighthouse-lambda` will download a Headless Chrome binary if it does not already exist. The binary is from [joytocode/headless-chrome-builder](https://github.com/joytocode/headless-chrome-builder) and is tested to make sure it works with Lighthouse.

## Lambda function

```js
// index.js

const createLighthouse = require('lighthouse-lambda')

exports.handler = function (event, context, callback) {
  Promise.resolve()
    .then(() => createLighthouse('https://example.com', { logLevel: 'info' }))
    .then(({ chrome, start, createReport }) => {
      return start()
        .then((results) => {
          // Do something with `results`
          const html = createReport(results)
          // Do something with the html report
          return chrome.kill().then(() => callback(null))
        })
        .catch((error) => {
          // Handle errors when running Lighthouse
          return chrome.kill().then(() => callback(error))
        })
    })
    // Handle other errors
    .catch(callback)
}
```

## Testing locally

You can use [docker-lambda](https://github.com/lambci/docker-lambda) to test your Lambda function locally.

```bash
$ docker run --rm -v "$PWD":/var/task lambci/lambda:nodejs8.10 index.handler
```

## Deployment

You can use [docker-lambda](https://github.com/lambci/docker-lambda) to install dependencies and pack your Lambda function.

```bash
$ docker run --rm -v "$PWD":/var/task lambci/lambda:build-nodejs8.10 bash -c "rm -rf node_modules && npm install"

$ docker run --rm -v "$PWD":/var/task lambci/lambda:build-nodejs8.10 bash -c "rm -f *.zip && zip lambda.zip -r node_modules index.js package.json"
```

- The file will be big (at least 80MB), so you need to upload it to S3 then deploy to Lambda from S3.
- You should allocate at least 512 MB memory and 15 seconds timeout to the function.

## API

### createLighthouse(url, [options], [config])

Same parameters as [Using Lighthouse programmatically](https://github.com/GoogleChrome/lighthouse/blob/master/docs/readme.md#using-programmatically).

Returns a `Promise` of an Object with the following fields:

- `chrome`: an instance of [`chromeLauncher.launch()`](https://github.com/GoogleChrome/chrome-launcher#launchopts).
- `log`: an instance of [lighthouse-logger](https://github.com/GoogleChrome/lighthouse/tree/master/lighthouse-logger) (only if you set `options.logLevel`).
- `start(options)`: a function to start the scan which returns a `Promise` of Lighthouse results.
  - `options.saveArtifacts`: a flag to indicate whether result artifacts should be saved (default: `false`).
- `createReport(results)`: a function to create html report from Lighthouse results.

## License

[MIT](LICENSE)
