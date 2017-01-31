/**
 * Peforms a GET web query to the Pathway Commons web service
 * @module get
 * @param {object} query_object - Object representing the query parameters to be sent along with the get command.
 * @param {requestCallback} callback - Terminating callback, see below for arguments.
 */
const get = (query_object, callback) => {
	/**
	* Callback for get function, which is always called on completion
	*
	* @callback requestCallback
	* @param {string} responseStatus - A string which indicates failure, no results returned, or success.
	* @param {string} responseText - Response text, which is the string returned from PC if available, else empty string. Remains as string because data returned can be in multiple formats.
	*/
	callback(responseStatus, responseText);
}

export default get;
