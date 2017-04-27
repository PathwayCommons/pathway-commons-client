Pathway Commons JS Library [![Build Status](https://travis-ci.org/PathwayCommons/cpath2-client.svg?branch=master)](https://travis-ci.org/PathwayCommons/cpath2-client)
================

# Description
This library is an interface for accessing the Pathway Commons web API, which is designed to make Pathway Commons easier to work with. In addition, it contains useful optimisations to improve efficiency, and various tools which may be useful when working with Pathway Commons data.

The library makes use of promises in order to keep the API clean. Therefore, if you must support browsers which [do not natively support promises](http://caniuse.com/#feat=promises), please include a polyfill in your project.

### Getting Started
This library can be included directly using a script tag, or it can be imported using several methods. This library is available on NPM.

CommonJS:
```
var pathwayCommons = require('pathway-commons');
```

ES6 Imports:
```
// The entire library can be imported
import pathwayCommons from 'pathway-commons';
// Or only the necessary functions
import {utilities, search} from 'pathway-commons';
```

### Setting a username
We request that our users set a username, which allows us to see how our users use both the pathway-commons library and the Pathway Commons service. If no username is registered, then the username is set to a default ID. If you wish to opt out, set the user as `null`.

### Usage Example
```
var pathwayCommons = require('pathway-commons'); // Import library

pathwayCommons.utilities.user('pathway-commons-demo'); // Set a username

pathwayCommons.search() // Initialise a new Pathway Commons search request
  .q("insulin") // Set the q parameter
  .datasource(["inoh", "reactome"]) // Set the datasource parameter
  .type("pathway") // Set the type parameter
  .organism("homo sapiens") // Set the orgamism parameter
  .format("json") // Set the output format
  .fetch() // Send the request to the Pathway Commons service
  .then((obj) => { // Receive the response asynchronously
    console.log(obj);
  });

pathwayCommons.search() // Or use an object containing all request parameters
  .query({
    q: "insulin",
    datasource: [
      "inoh",
      "reactome"
    ],
    type: "pathway",
    organism: "homo sapiens"
  })
  .format("json")
  .fetch()
  .then((obj) => {
    console.log(obj);
  });
```

See unit tests or documentation for more examples on how the library can be used.

# Build

### Required Software

- [Node.js](https://nodejs.org/en/) >=4.0.0. In order to support earlier versions, compile for node and add polyfills for missing features (etc. Promises).



### Configuration

The following environment variables can be used to configure the server:

- `NODE_ENV` : the environment mode, either `production` or `development` (default)
- `PORT` : the port on which the server runs (default 3000)



### Run targets

- `npm run build` : build project
- `npm run build-prod` : build the project for production
- `npm run clean` : clean the project
- `npm run watch` : watch mode (debug mode enabled, auto rebuild, livereload)
- `npm test` : run tests
- `npm run lint` : lint the project
- `npm run docs` : Generate documentation and place resulting HTML files in the docs folder



### Testing

All files `/test` will be run by [Mocha](https://mochajs.org/).  You can `npm test` to run all tests, or you can run `mocha -g specific-test-name` (prerequisite: `npm install -g mocha`) to run specific tests.

[Chai](http://chaijs.com/) is included to make the tests easier to read and write.
