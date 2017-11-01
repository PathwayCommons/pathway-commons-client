'use strict';
var constants = require('./constants.js');

var fetch = require('fetch-ponyfill')().fetch;
var isEmpty = require('lodash.isempty');
var isArray = require('lodash.isarray');
var isObject = require('lodash.isobject');
var stringify = require('query-string').stringify;

var utilities = require('../utilities.js');
var validateString = require('./helpers.js').validateString;

/**
 * @class
 * @classdesc Class for use in fetch requests to Pathway Commons
 */
module.exports = class PcRequest {
  constructor(commandValue, submitId, userOverride) {
    if (!(validateString(commandValue))) {
      throw new SyntaxError("PcRequest constructor parameter invalid");
    }
    Object.defineProperty(this, "submitId", {
      get: () => {
        return (submitId === false) ? false : true;
      }
    });
    Object.defineProperty(this, "command", {
      get: () => {
        return commandValue;
      }
    });
    Object.defineProperty(this, "user", {
      get: () => {
        return userOverride ? userOverride : utilities.user();
      }
    });

    this.queryObject = {};
    this.formatString = "";
  }

  query(queryObject) {
    if (isObject(queryObject)) {
      this.queryObject = Object.assign({}, queryObject);
    }

    return this;
  }

  set(parameter, value) {
    parameter = String(parameter);
    if (parameter !== "") {
      if (value === "" || (isArray(value) && isEmpty(value))) {
        this.delete(parameter);
      } else {
        this.queryObject[parameter] = value;
      }
    }

    return this;
  }

  delete(parameter) {
    delete this.queryObject[parameter];

    return this;
  }

  format(formatString) {
    const acceptedStrings = [
      "json",
      "xml",
      ""
    ];

    if (acceptedStrings.indexOf(formatString) !== -1) {
      this.formatString = formatString;
    }

    return this;
  }

  fetch() {
    var url = constants.pcAddress + this.command + (this.formatString ? "." + this.formatString : "") + "?" + stringify(Object.assign({}, this.queryObject, this.submitId ? {
      user: this.user
    } : {}));

    return fetch(url, {method: 'GET', mode: 'no-cors'}).then(res => {
      switch (res.status) {
        case 200:
          // To read headers from both node and browser fetch
          var contentType = res.headers._headers ? res.headers._headers["content-type"][0] : res.headers.map["content-type"];
          return contentType.toLowerCase().indexOf("json") !== -1 ? res.json() : res.text();
        case 500:
          return null;
        default:
          throw new Error(res.status);
      }
    });
  }
};
