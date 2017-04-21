Pathway Commons JS Library [![Build Status](https://travis-ci.org/mj3cheun/pathway-commons.svg?branch=master)](https://travis-ci.org/mj3cheun/pathway-commons)
================



## Required software

- [Node.js](https://nodejs.org/en/) >=4.0.0. In order to support earlier versions, compile for node and add polyfills for missing features (etc. Promises).



## Configuration

The following environment variables can be used to configure the server:

- `NODE_ENV` : the environment mode, either `production` or `development` (default)
- `PORT` : the port on which the server runs (default 3000)



## Run targets

- `npm run build` : build project
- `npm run build-prod` : build the project for production
- `npm run clean` : clean the project
- `npm run watch` : watch mode (debug mode enabled, auto rebuild, livereload)
- `npm test` : run tests
- `npm run lint` : lint the project
- `npm run docs` : Generate documentation and place resulting HTML files in the docs folder



## Testing

All files `/test` will be run by [Mocha](https://mochajs.org/).  You can `npm test` to run all tests, or you can run `mocha -g specific-test-name` (prerequisite: `npm install -g mocha`) to run specific tests.

[Chai](http://chaijs.com/) is included to make the tests easier to read and write.
