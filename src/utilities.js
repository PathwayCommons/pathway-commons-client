'use strict';
var fetch = require('fetch-ponyfill')().fetch;
var constants = require('./private/constants.js');

module.exports = {
  /**
   * @param {number} timeout
   * @return {boolean} PC2 Status
   */
  pcCheck: (timeout) => { // timeout is in milliseconds
    var address = constants.pcAddress;
    var timeoutValue = Number(timeout != null ? timeout : 0) || 1000; // default timeout is 1000ms
    return new Promise((resolve, reject) => {
      if (typeof XMLHttpRequest !== "undefined") { // Assume browserside: done using xhr because network connections cancellable
        var xhttp = new XMLHttpRequest();
        var timeoutRef = setTimeout(() => {
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
        var timeoutRef = setTimeout(() => {
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
          .catch(e => {
            clearTimeout(timeoutRef);
            resolve(false);
          });
      }
    });
  },

  /**
   * @param {string} sourceName
   * @param {string} id
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
}
