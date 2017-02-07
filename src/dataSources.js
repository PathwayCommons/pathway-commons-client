import {Promise} from 'es6-promise';
import {fetchRequest} from './private/fetchRequest.js';

import isObject from 'lodash/isObject';

/**
 * Fetches an array of datasources from PC.
 * @module dataSources
 */
class dataSources extends fetchRequest {
  constructor() {
    super({
      user: "pc2pathways"
    });
    this.command = "metadata/datasources";
    this.data = undefined;
    this.fetch();

    // Private functions
    this.promisifyData = () => {
      if (this.data !== undefined) {
        return new Promise((resolve) => {
          resolve(this.data)
        });
      } else {
        return this.fetch().then(() => {
          return this.data
        });
      }
    }

    return this;
  }

  /**
  * Purges existing data source cache and makes a call to PC to re-get data sources.
  * @function - fetch
  */
  fetch() {
    return super.fetch().then((response) => {
      if (isObject(response)) {
        var output = {};
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
        this.data = output;
      } else {
        this.data = false;
      }
      return this.data;
    });
  }

  /**
  * Returns array of data sources from PC. Caches array for use in later calls.
  * @function - get
  * @returns {Promise<array>|Promise<boolean>} - Returns promise containing either the data source array or false if not data source not available
  */
  get(callback) {
    if (callback !== undefined) {
      this.promisifyData().then(() => callback(this.data));
    } else {
      return this.promisifyData();
    }
  }
}

module.exports = new dataSources();
