import {Promise} from 'es6-promise';
import {fetchRequest} from './private/fetchRequest.js';
import {_buildUniprotUri} from './private/helpers.js';

/**
 * @class
 * @classdesc Peforms a GET web query to the Pathway Commons web service
 */
class get extends fetchRequest {
  /**
   * Initialises get and sets query object if one is provided. Chainable.
   * @constructor
   * @param {object} [queryObject] - Object representing the query parameters to be sent along with the get command.
   * @returns {this}
   */
  constructor(queryObject) {
    super(queryObject);
    this.command = "get";
    return this;
  }

  /**
   * Sets uri parameter which is to be sent with the get request
   * @param {object} queryObject - Object representing the query parameters to be sent along with the get command.
   * @returns {this}
   */
  query(queryObject) {
    return super.query(queryObject);
  }

  /**
   * Sets uri parameter which is to be sent with the get request
   * @param {string} value - uri
   * @returns {this}
   */
  uri(value) {
    return super.set("uri", value);
  }

  /**
   * Sets uri parameter using the uniprot ID
   * @param {string} value - uri
   * @returns {this}
   */
  uniprot(uniprotId) {
    return this.uri(_buildUniprotUri(uniprotId));
  }

  /**
   * Sets format parameter which is to be sent with the get request
   * @param {string} value - format
   * @returns {this}
   */
  format(value) {
    return super.set("format", value);
  }

  /**
   * Initialises get and sets query object if one is provided
   * @return {Promise<string>|Promise<object>|Promise<boolean>} - Promise returning either an object or string depending on format
   *
   */
  /** Initialises get and sets query object if one is provided
   * @param {requestCallback} [callback] - Terminating callback, see below for arguments
   * @return {this}
   */
  fetch(callback) {
    return super.fetch().then((response) => {
      if (callback !== undefined) {
        /**
         * Callback for get function, which is always called on completion
         *
         * @callback get~requestCallback
         * @param {string|object|boolean} response - Response text or object returned from PC if available. Otherwise if no response returned, returns false. If there was a network failure, null returned.
         */
        callback(response);
        return this;
      } else {
        return response;
      }
    });
  }
}

module.exports = get;
