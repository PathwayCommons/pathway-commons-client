'use strict';

var fetch = require('node-fetch');
var isEmpty = require('lodash/isEmpty');
var isArray = require('lodash/isArray');
var isObject = require('lodash/isObject');
var stringify = require('query-string').stringify;

/**
 * @class
 * @classdesc Class for use in fetch requests to Pathway Commons
 */
module.exports = class PcRequest {
  constructor(commandValue) {
    if ((typeof commandValue !== "string") || (commandValue === "")) {
      throw new SyntaxError("PcRequest constructor parameter invalid");
    }
    Object.defineProperty(this, "pcUrl", {
      get: () => {
        return "http://www.pathwaycommons.org/pc2/";
      }
    });
    Object.defineProperty(this, "command", {
      get: () => {
        return commandValue;
      }
    });

    this.queryObject = {};
  }

  query(queryObject) {
    if (isObject(queryObject)) {
      this.queryObject = queryObject;
    }

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

    return this;
  }

  fetch() {
    var url = this.pcUrl + this.command + "?" + stringify(this.queryObject);

    return fetch(url).then((res) => {
      switch (res.status) {
        case 200:
          return res.headers._headers["content-type"][0].toLowerCase().indexOf("json") !== -1 ? res.json() : res.text();
          break;
        case 500:
          return null;
          break;
        default:
          throw new Error(res.status);
      }
    });
  }
}
