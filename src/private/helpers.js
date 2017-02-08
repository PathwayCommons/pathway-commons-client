'use strict';

module.exports = {
  /**
   * @private
   * @param {string} jsonString
   * @return {object|string} jsonObject - If valid JSON parse as JSON otherwise return original string
   */
  _parseUnknownString: (string) => {
    try {
      return JSON.parse(string);
    } catch (e) {
      return string;
    }
  },

  /**
   * @private
   * @param {string} uniprotId
   * @return {string} uniprotUri
   */
  _buildUniprotUri: (uniprodId) => {
    return "http://identifiers.org/uniprot/" + uniprodId;
  }
}
