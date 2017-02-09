'use strict';

var PcRequest = require('./private/pc-request.js');
var _uniprotCheck = require('./private/helpers.js')._uniprotCheck;
var _chebiCheck = require('./private/helpers.js')._chebiCheck;
var _hgncCheck = require('./private/helpers.js')._hgncCheck;

/**
 * @class
 * @classdesc Peforms a GET web query to the Pathway Commons web service
 */
module.exports = class Graph {
  /**
   * Initialises get and sets query object if one is provided. Chainable.
   * @constructor
   * @param {object} [queryObject] - Object representing the query parameters to be sent along with the get command.
   * @returns {this}
   */
  constructor(queryObject) {
    this.request = new PcRequest("graph").query(queryObject);
  }

  /**
   * Sets uri parameter using the uniprot ID with regex ID format checking
   * @param {string} value - uri
   * @returns {this}
   */
  uniprot(uniprotId) {
    uniprotId = uniprotId.toUpperCase();
    if (_uniprotCheck(uniprotId)) {
      this.uri(uniprotId);
    } else {
      throw new SyntaxError("Invalid UniProt ID");
    }

    return this;
  }

  /**
   * Sets uri parameter using the ChEBI ID with regex ID format checking
   * @param {string} value - uri
   * @returns {this}
   */
  chebi(chebiId) {
    chebiId = chebiId.toUpperCase();
    if (_chebiCheck(chebiId)) {
      this.uri(chebiId);
    } else {
      throw new SyntaxError("Invalid ChEBI ID");
    }

    return this;
  }

  /**
   * Sets uri parameter using the HGNC ID with regex ID format checking
   * @param {string} value - uri
   * @returns {this}
   */
  hgnc(hgncId) {
    if (_hgncCheck(hgncId)) {
      this.uri(hgncId);
    } else {
      throw new SyntaxError("Invalid HGNC Symbol ID");
    }

    return this;
  }
}
