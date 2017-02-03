import {fetchRequest} from './private/helpers.js';

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
	 * Sets format parameter which is to be sent with the get request
	 * @param {string} value - format
	 * @returns {this}
	 */
	format(value) {
		return super.set("format", value);
	}

	/**
	 * Initialises get and sets query object if one is provided
	 * @return {Promise<Array>} - Promise returning an array containing status and response properties
	 *
	 *//** Initialises get and sets query object if one is provided
	 * @param {requestCallback} [callback] - Terminating callback, see below for arguments
	 * @return {this}
	 */
	fetch(callback) {
		return super.fetch().then((responseObject) => {
			if(callback !== undefined) {
				/**
				* Callback for get function, which is always called on completion
				*
				* @callback get~requestCallback
				* @param {string} responseStatus - A string which indicates failure, no results returned, or success.
				* @param {string} responseText - Response text, which is the string returned from PC if available, else empty string. Remains as string because data returned can be in multiple formats.
				*/
				callback(responseObject.statusString, responseObject.response);
				return this;
			}
			else {
				return {
					status: responseObject.statusString,
					response: responseObject.response
				};
			}
		});
	}
}

module.exports = get;
