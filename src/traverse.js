'use strict';

/**
 * Peforms a SEARCH web query to the Pathway Commons web service
 * @module traverse
 * @param {object} query_object - Object representing the query parameters to be sent along with the traverse command.
 * @param {requestCallback} callback - Terminating callback, see below for arguments.
 */
module.exports = (query_array, callback) => {
	/**
	* Callback for traverse function, which is always called on completion
	*
	* @callback requestCallback
	* @param {string} responseStatus - A string which indicates failure, no results returned, or success.
	* @param {object} responseObject - A parsed JSON object returned from PC if available, else empty object. Result from traverse is assumed to be in JSON format.
	*/
	callback(responseStatus, responseObject);
}
