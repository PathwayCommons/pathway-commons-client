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
  },

  /**
   * @private
   * @param {string} sourceName
   * @param {string} id
   * @return {boolean} idValidity
   */
  sourceCheck: (sourceName, id) => {
    var checkFunction = module.exports[sourceName.toLowerCase() + "Check"];
    if ((typeof checkFunction === "function") && (sourceName !== "source")) {
      checkFunction(id);
    } else {
      throw new SyntaxError(sourceName + " is an invalid source");
    }
  },

  /**
   * @private
   * @param {string} uniprotId
   * @return {boolean} idValidity
   */
  uniprotCheck: (uniprodId) => {
    return /^([A-N,R-Z][0-9]([A-Z][A-Z, 0-9][A-Z, 0-9][0-9]){1,2})|([O,P,Q][0-9][A-Z, 0-9][A-Z, 0-9][A-Z, 0-9][0-9])(\.\d+)?$/.test(uniprodId);
  },

  /**
   * @private
   * @param {string} chebiId
   * @return {boolean} idValidity
   */
  chebiCheck: (chebiId) => {
    return /^CHEBI:\d+$/.test(chebiId) && (chebiId.length <= ("CHEBI:".length + 6));
  },

  /**
   * @private
   * @param {string} hgncId
   * @return {boolean} idValidity
   */
  hgncCheck: (hgncId) => {
    return /^[A-Za-z-0-9_]+(\@)?$/.test(hgncId);
  }
}
