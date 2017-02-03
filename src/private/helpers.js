require('es6-promise').polyfill();
require('isomorphic-fetch');

import {isEmpty, isArray} from 'lodash';
import {stringify as queryStringify} from 'query-string';

// Private Functions
/**
 * @private
 * @param {string} url
 * @param {requestCallback} callback - responseText
 */
export const _httpGetAsync = (url, callback) => {
	callback(httpResponseText);
}

/**
 * @private
 * @param {string} jsonString
 * @return {object} jsonObject
 */
export const _parseJson = (jsonString) => {
	return attempt(JSON.parse.bind(null, string));
}

/**
* @class
* @classdesc Base class for use in fetch requests, not intended to be used on its own
*/
export class fetchRequest {
	constructor(queryObject) {
		this.pcUrl = "http://www.pathwaycommons.org/pc2/";
		this.command = "TO_BE_REPLACED";
		this.responseText = "";
		if(queryObject !== undefined) {
			this.queryObject = queryObject;
		}
		else {
			this.queryObject = {};
		}

		return this;
	}

	query(queryObject) {
		this.queryObject = queryObject;
		return this;
	}

	set(parameter, value) {
		parameter = String(parameter);
		if(parameter !== "") {
			if(value === "" || (isArray(value) && !isEmpty(value))) {
				this.delete(parameter);
			}
			else {
				this.queryObject[parameter] = value;
			}
		}

		return this;
	}

	delete(parameter) {
		delete this.queryObject[parameter];
	}

	fetch(args) {
		var fetchPromise = fetch(this.pcUrl + this.command + "?" + queryStringify(this.queryObject));
		var responseCode = fetchPromise.then((responseObject) => {
				return responseObject;
			});

		var responseText = fetchPromise.then((responseObject) => {
				return args && (args.format === json) ? responseObject.json() : responseObject.text();
			})
			.then((responseString) => {
				return responseString;
			});

		return Promise.all([responseCode, responseText]).then((promiseArray) => {
				return {
					statusCode: promiseArray[0].status,
					statusString: this.generateStatusString(promiseArray[0].status),
					response: promiseArray[1]
				};
			})
			.catch((error) => {
				return {
					statusString: "FAIL",
					response: error
				};
			});
	}

	generateStatusString(responseCode) {
		const translationObject = {
			200: "SUCCESS",
			500: "EMPTY",
			501: "SERVER_ERROR",
			404: "FAIL"
		};
		return translationObject[responseCode] || "UNKNOWN";
	}
}
