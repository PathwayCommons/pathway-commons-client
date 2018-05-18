'use strict';
var fetch = require('fetch-ponyfill')().fetch;
var constants = require('./private/constants.js');
var helpers = require('./private/helpers.js');

// Declare private variables
var _id;
var _endpoint;

/**
 * @module utilities
 */
module.exports = {
  /**
   * @param {string} [newId] - If given string, sets a new user ID. If null, turns off user id. Else simply returns current ID.
   * @return {string} id - Current user ID
   */
  user: (newId) => {
    if(_id === undefined || newId !== undefined) {
      if(typeof newId === "string") {
        newId = constants.idPrefix + newId;
      }
      else if(newId === null) {
        newId = "";
      }
      else if(newId === undefined) {
        newId = constants.idPrefix + "default";
      }
      _id = newId;
    }
    return _id;
  },

  /**
   * @param {string} [newEndpoint] - If given valid string, sets a new pathway commons endpoint. If empty string, resets endpoint to default. Otherwise do nothing.
   * @return {string} endpoint - Current endpoint
   */
  endpoint: (newEndpoint) => {
    if(_endpoint === undefined || newEndpoint !== undefined) {
      if(!helpers.validateString(newEndpoint)) {
        newEndpoint = constants.pcAddress;
      }
      _endpoint = newEndpoint;
    }
    return _endpoint;
  },

  /**
   * @param {number} [timeout=1000] Sets length of time before timeout in milliseconds
   * @return {boolean} PC2 Status
   */
  pcCheck: function(timeout) { // timeout is in milliseconds
    var address = this.endpoint() + "search?q=p53&user=" + constants.idPrefix + "pcCheck";
    var timeoutValue = Number(timeout != null ? timeout : 0) || 1000; // default timeout is 1000ms
    return new Promise(resolve => {
      var timeoutRef;
      if (typeof XMLHttpRequest !== "undefined") { // Assume browserside: done using xhr because network connections cancellable
        var xhttp = new XMLHttpRequest();
        timeoutRef = setTimeout(() => {
          xhttp.abort();
          resolve(false);
        }, timeoutValue);
        xhttp.open("GET", address);
        xhttp.onreadystatechange = () => {
          if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
            clearTimeout(timeoutRef);
            resolve(true);
          }
        };
        xhttp.send();
      } else { // Assume serverside: done using fetch as ponyfill already available and residual network connections immaterial
        timeoutRef = setTimeout(() => {
          resolve(false);
        }, timeoutValue);
        fetch(address, {
            method: 'get',
            timeout: timeoutValue
          })
          .then(response => {
            if (response.status === 200) {
              clearTimeout(timeoutRef);
              resolve(true);
            } else {
              clearTimeout(timeoutRef);
              resolve(false);
            }
          })
          .catch(() => {
            clearTimeout(timeoutRef);
            resolve(false);
          });
      }
    });
  },

  /**
   * @param {string} sourceName - Name of source type to validate against (eg. uniprot)
   * @param {string} id - ID to validate
   * @return {boolean} idValidity
   */
  sourceCheck: (sourceName, id) => {
    var checkFunction = constants.dsIdValidation[
      sourceName
        .toLowerCase() // Make all lowercase
        .replace(/[^a-zA-Z0-9]/g, "") // Remove any non letter or number symbols
    ];
    if (typeof checkFunction === "function") {
      return checkFunction(id);
    } else {
      throw new SyntaxError(sourceName + " is an invalid source");
    }
  }
};
