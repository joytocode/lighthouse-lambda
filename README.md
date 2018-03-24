# lighthouse-lambda
> Run [Google Chrome Lighthouse](https://github.com/GoogleChrome/lighthouse) on [AWS Lambda](https://aws.amazon.com/lambda/)

## Installation

```
$ npm install lighthouse-lambda --save
```

The postinstall script of `lighthouse-lambda` will download a headless chrome binary if it does not already exist. The binary is from [serverless-chrome](https://github.com/adieuadieu/serverless-chrome) and is tested to make sure it works with Lighthouse.

## Lambda function

```js
// index.js

const createLighthouse = require('lighthouse-lambda')

exports.handler = function (event, context, callback) {
  Promise.resolve()
    .then(() => createLighthouse('https://example.com', { logLevel: 'info' }))
    .then(({ chrome, start }) => {
      return start()
        .then((results) => {
          // Do something with `results`
          return chrome.kill().then(() => callback(null))
        })
    })
    .catch(callback)
}
```

## Testing locally

You can use [docker-lambda](https://github.com/lambci/docker-lambda) to test your Lambda function locally.

```
$ docker run --rm -v "$PWD":/var/task lambci/lambda:nodejs6.10 index.handler
```

## Deployment

You can use [docker-lambda](https://github.com/lambci/docker-lambda) to install dependencies and pack your Lambda function.

```
$ docker run --rm -v "$PWD":/var/task lambci/lambda:build-nodejs6.10 rm -rf node_modules && npm install

$ docker run --rm -v "$PWD":/var/task lambci/lambda:build-nodejs6.10 rm -f *.zip && zip lambda.zip -r node_modules index.js package.json
```

- The file will be big (at least 75MB), so you need to upload it to S3 before deploying to Lambda from S3.
- You should allocate at least 512 MB memory and 15 seconds timeout to the function.

## API

### createLighthouse(url, [options], [config])

Same parameters as [Using Lighthouse programmatically](https://github.com/GoogleChrome/lighthouse/blob/master/docs/readme.md#using-programmatically).

Returns a `Promise` of an Object with the following fields:

- `chrome`: an instance of [`chromeLauncher.launch()`](https://github.com/GoogleChrome/chrome-launcher#launchopts).
- `log`: an instance of [lighthouse-logger](https://github.com/GoogleChrome/lighthouse/tree/master/lighthouse-logger) (only if you set `options.logLevel`).
- `start`: a function to start the scan which returns a `Promise` of Lighthouse results.

## License

[MIT](LICENSE)
