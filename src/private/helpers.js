'use strict';
var constants = require('./constants.js');

module.exports = {
  /**
   * @private
   * @param {string} string - String to be checked
   * @return {boolean} Returns true if input is a non-empty string else returns false
   */
  validateString: (string) => {
    if ((typeof string === "string") && (string.length !== 0)) {
      return true;
    } else {
      return false;
    }
  },

  /**
   * @private
   * @param {string} inputString - String to be checked
   * @return {string} Clean string
   */
  escapeLucene: (inputString) => {
    return inputString.replace(/([\!\*\+\-\&\|\(\)\[\]\{\}\^\~\?\:\/\\"])/g, "\\$1");
  }
}
