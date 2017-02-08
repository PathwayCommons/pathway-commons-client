'use strict';

var isObject = require('lodash/isObject');

var PcRequest = require('./private/pc-request.js');

/**
 * Fetches an array of datasources from PC.
 * @module dataSources
 */
module.exports = class Datasources {
  constructor() {
    this.request = new PcRequest("metadata/datasources").query({
      user: "pc2pathways"
    });
    this.data = this.fetch();
  }

  /**
   * Makes a fetch request to PC requesting data sources. If called after class initialization, purges existing data source cache and makes a call to PC to re-fetch data sources.
   * @function - fetch
   */
  fetch() {
    var dataPromise = this.request.fetch().then((response) => {
      var output = {};
      if (isObject(response)) {
        response
          .filter(source => source.notPathwayData == false)
          .map((ds) => {
            var name = (ds.name.length > 1) ? ds.name[1] : ds.name[0];
            output[ds.uri] = {
              id: ds.identifier,
              uri: ds.uri,
              name: name,
              description: ds.description,
              type: ds.type
            };
          });
      } else {
        output = null;
      }
      return output;
    }).catch(() => {
      return null;
    });

    this.data = dataPromise;
    return dataPromise;
  }

  /**
   * Returns promise containing data sources from PC.
   * @function - get
   * @returns {Promise<object>} - Returns promise containing either the data source array or null if data source is not available
   */
  get(callback) {
    if (callback !== undefined) {
      this.data.then((data) => callback(data));
    } else {
      return this.data;
    }
  }
}
