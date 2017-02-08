'use strict';

var fetch = require('node-fetch');
var isEmpty = require('lodash/isEmpty');
var isArray = require('lodash/isArray');
var isObject = require('lodash/isObject');
var stringify = require('query-string').stringify;

var _parseUnknownString = require('./helpers.js')._parseUnknownString;

/**
 * @class
 * @classdesc Base class for use in fetch requests, not intended to be used on its own
 */
module.exports = class PcRequest {
  constructor(queryObject) {
    this.pcUrl = "http://www.pathwaycommons.org/pc2/";
    this.command = "TO_BE_REPLACED";
    this.responseText = "";
    this.queryObject = {};
    if (queryObject !== undefined) {
      this.queryObject = queryObject;
    }

    return this;
  }

  query(queryObject) {
    this.queryObject = queryObject;
    return this;
  }

  set(parameter, value) {
    parameter = String(parameter);
    if (parameter !== "") {
      if (value === "" || (isArray(value) && !isEmpty(value))) {
        this.delete(parameter);
      } else {
        this.queryObject[parameter] = value;
      }
    }

    return this;
  }

  delete(parameter) {
    delete this.queryObject[parameter];
  }

  fetch() {
    var fetchPromise = fetch(this.pcUrl + this.command + "?" + stringify(this.queryObject));
    var responseCode = fetchPromise.then((responseObject) => {
      return responseObject;
    });

    var responseText = fetchPromise.then((responseObject) => {
        return responseObject.text();
      })
      .then((responseString) => {
        this.responseText = responseString;
        return responseString;
      });

    return Promise.all([responseCode, responseText]).then((promiseArray) => {
        switch (promiseArray[0].status) {
          case 200:
            return _parseUnknownString(promiseArray[1]);
            break;
          case 500:
            return false;
            break;
          default:
            return null;
        }
      })
      .catch((error) => {
        return null;
      });
  }
}
