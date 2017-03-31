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
   * @param {string} string - String to be checked
   * @return {boolean} Returns true if string exists in pc2Formats array else returns false
   */
  validateWithConstArray: (constArrayName, string) => {
    if ((typeof string === "string") && (constants[constArrayName].indexOf(string) !== -1)) {
      return true;
    } else {
      return false;
    }
  }
}
