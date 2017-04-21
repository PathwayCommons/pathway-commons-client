'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var isObject = require('lodash/isObject');

var constants = require('./private/constants.js');
var PcRequest = require('./private/pc-request.js');

/**
 * @class
 * @classdesc Fetches an array of datasources from PC.
 * @alias datasources
 */
module.exports = function () {
  /**
   * Initialises datasources and makes a request to PC server fetching datasource data. Chainable.
   * @constructor
   * @returns {this}
   */
  function Datasources() {
    _classCallCheck(this, Datasources);

    this.request = new PcRequest("metadata/datasources", false, constants.idPrefix + "datasources");
    this.data = this.refresh();
  }

  /**
   * Makes a fetch request to PC requesting data sources. If called after class initialization, purges existing data source cache and makes a call to PC to re-fetch data sources.
   * @method datasources#refresh
   * @returns {Promise<object>} - Returns promise containing either the data source array or null if data source is not available
   */


  _createClass(Datasources, [{
    key: 'refresh',
    value: function refresh() {
      var dataPromise = this.request.fetch().then(function (response) {
        var output = {};
        if (isObject(response)) {
          response.filter(function (source) {
            return source.notPathwayData == false;
          }).map(function (ds) {
            var name = ds.name.length > 1 ? ds.name[1] : ds.name[0];
            output[ds.uri] = {
              id: ds.identifier,
              uri: ds.uri,
              name: name,
              description: ds.description,
              type: ds.type,
              iconUrl: ds.iconUrl
            };
          });
        } else {
          output = null;
        }
        return output;
      }).catch(function () {
        return null;
      });

      this.data = dataPromise;
      return dataPromise;
    }

    /**
     * Returns promise containing data sources from PC.
     * @method datasources#fetch
     * @returns {Promise<object>} - Returns cached promise from the fetch method
     */

  }, {
    key: 'fetch',
    value: function fetch() {
      return this.data;
    }

    /**
     * Fetches the logo for the datasource using either datasources URI or name. Intended to be used to generate image tags for thumbnails.
     * @method datasources#lookupIcon
     * @param {string} dsUriOrName - Either URI or name of the data source
     * @return {Promise<string>} logoUrl - Promise containing URL of datasource in question, else undefined if datasource not found
     */

  }, {
    key: 'lookupIcon',
    value: function lookupIcon(dsUriOrName) {
      dsUriOrName = dsUriOrName || "";
      return this.data.then(function (dataSources) {
        for (var key in dataSources) {
          var ds = dataSources[key];
          if (ds.uri == dsUriOrName || ds.name.toLowerCase() == dsUriOrName.toLowerCase()) {
            return ds.iconUrl;
          }
        }
      });
    }
  }]);

  return Datasources;
}();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhdGFzb3VyY2VzLmpzIl0sIm5hbWVzIjpbImlzT2JqZWN0IiwicmVxdWlyZSIsImNvbnN0YW50cyIsIlBjUmVxdWVzdCIsIm1vZHVsZSIsImV4cG9ydHMiLCJyZXF1ZXN0IiwiaWRQcmVmaXgiLCJkYXRhIiwicmVmcmVzaCIsImRhdGFQcm9taXNlIiwiZmV0Y2giLCJ0aGVuIiwicmVzcG9uc2UiLCJvdXRwdXQiLCJmaWx0ZXIiLCJzb3VyY2UiLCJub3RQYXRod2F5RGF0YSIsIm1hcCIsImRzIiwibmFtZSIsImxlbmd0aCIsInVyaSIsImlkIiwiaWRlbnRpZmllciIsImRlc2NyaXB0aW9uIiwidHlwZSIsImljb25VcmwiLCJjYXRjaCIsImRzVXJpT3JOYW1lIiwiZGF0YVNvdXJjZXMiLCJrZXkiLCJ0b0xvd2VyQ2FzZSJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQUVBLElBQUlBLFdBQVdDLFFBQVEsaUJBQVIsQ0FBZjs7QUFFQSxJQUFJQyxZQUFZRCxRQUFRLHdCQUFSLENBQWhCO0FBQ0EsSUFBSUUsWUFBWUYsUUFBUSx5QkFBUixDQUFoQjs7QUFFQTs7Ozs7QUFLQUcsT0FBT0MsT0FBUDtBQUNFOzs7OztBQUtBLHlCQUFjO0FBQUE7O0FBQ1osU0FBS0MsT0FBTCxHQUFlLElBQUlILFNBQUosQ0FBYyxzQkFBZCxFQUFzQyxLQUF0QyxFQUE2Q0QsVUFBVUssUUFBVixHQUFxQixhQUFsRSxDQUFmO0FBQ0EsU0FBS0MsSUFBTCxHQUFZLEtBQUtDLE9BQUwsRUFBWjtBQUNEOztBQUVEOzs7Ozs7O0FBWEY7QUFBQTtBQUFBLDhCQWdCWTtBQUNSLFVBQUlDLGNBQWMsS0FBS0osT0FBTCxDQUFhSyxLQUFiLEdBQXFCQyxJQUFyQixDQUEwQixVQUFDQyxRQUFELEVBQWM7QUFDeEQsWUFBSUMsU0FBUyxFQUFiO0FBQ0EsWUFBSWQsU0FBU2EsUUFBVCxDQUFKLEVBQXdCO0FBQ3RCQSxtQkFDR0UsTUFESCxDQUNVO0FBQUEsbUJBQVVDLE9BQU9DLGNBQVAsSUFBeUIsS0FBbkM7QUFBQSxXQURWLEVBRUdDLEdBRkgsQ0FFTyxVQUFDQyxFQUFELEVBQVE7QUFDWCxnQkFBSUMsT0FBUUQsR0FBR0MsSUFBSCxDQUFRQyxNQUFSLEdBQWlCLENBQWxCLEdBQXVCRixHQUFHQyxJQUFILENBQVEsQ0FBUixDQUF2QixHQUFvQ0QsR0FBR0MsSUFBSCxDQUFRLENBQVIsQ0FBL0M7QUFDQU4sbUJBQU9LLEdBQUdHLEdBQVYsSUFBaUI7QUFDZkMsa0JBQUlKLEdBQUdLLFVBRFE7QUFFZkYsbUJBQUtILEdBQUdHLEdBRk87QUFHZkYsb0JBQU1BLElBSFM7QUFJZkssMkJBQWFOLEdBQUdNLFdBSkQ7QUFLZkMsb0JBQU1QLEdBQUdPLElBTE07QUFNZkMsdUJBQVNSLEdBQUdRO0FBTkcsYUFBakI7QUFRRCxXQVpIO0FBYUQsU0FkRCxNQWNPO0FBQ0xiLG1CQUFTLElBQVQ7QUFDRDtBQUNELGVBQU9BLE1BQVA7QUFDRCxPQXBCaUIsRUFvQmZjLEtBcEJlLENBb0JULFlBQU07QUFDYixlQUFPLElBQVA7QUFDRCxPQXRCaUIsQ0FBbEI7O0FBd0JBLFdBQUtwQixJQUFMLEdBQVlFLFdBQVo7QUFDQSxhQUFPQSxXQUFQO0FBQ0Q7O0FBRUQ7Ozs7OztBQTdDRjtBQUFBO0FBQUEsNEJBa0RVO0FBQ04sYUFBTyxLQUFLRixJQUFaO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUF0REY7QUFBQTtBQUFBLCtCQTREYXFCLFdBNURiLEVBNEQwQjtBQUN0QkEsb0JBQWNBLGVBQWUsRUFBN0I7QUFDQSxhQUFPLEtBQUtyQixJQUFMLENBQVVJLElBQVYsQ0FBZSxVQUFDa0IsV0FBRCxFQUFpQjtBQUNyQyxhQUFLLElBQUlDLEdBQVQsSUFBZ0JELFdBQWhCLEVBQTZCO0FBQzNCLGNBQUlYLEtBQUtXLFlBQVlDLEdBQVosQ0FBVDtBQUNBLGNBQUlaLEdBQUdHLEdBQUgsSUFBVU8sV0FBVixJQUF5QlYsR0FBR0MsSUFBSCxDQUFRWSxXQUFSLE1BQXlCSCxZQUFZRyxXQUFaLEVBQXRELEVBQWlGO0FBQy9FLG1CQUFPYixHQUFHUSxPQUFWO0FBQ0Q7QUFDRjtBQUNGLE9BUE0sQ0FBUDtBQVFEO0FBdEVIOztBQUFBO0FBQUEiLCJmaWxlIjoiZGF0YXNvdXJjZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJ2xvZGFzaC9pc09iamVjdCcpO1xuXG52YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9wcml2YXRlL2NvbnN0YW50cy5qcycpO1xudmFyIFBjUmVxdWVzdCA9IHJlcXVpcmUoJy4vcHJpdmF0ZS9wYy1yZXF1ZXN0LmpzJyk7XG5cbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIEZldGNoZXMgYW4gYXJyYXkgb2YgZGF0YXNvdXJjZXMgZnJvbSBQQy5cbiAqIEBhbGlhcyBkYXRhc291cmNlc1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIERhdGFzb3VyY2VzIHtcbiAgLyoqXG4gICAqIEluaXRpYWxpc2VzIGRhdGFzb3VyY2VzIGFuZCBtYWtlcyBhIHJlcXVlc3QgdG8gUEMgc2VydmVyIGZldGNoaW5nIGRhdGFzb3VyY2UgZGF0YS4gQ2hhaW5hYmxlLlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlcXVlc3QgPSBuZXcgUGNSZXF1ZXN0KFwibWV0YWRhdGEvZGF0YXNvdXJjZXNcIiwgZmFsc2UsIGNvbnN0YW50cy5pZFByZWZpeCArIFwiZGF0YXNvdXJjZXNcIik7XG4gICAgdGhpcy5kYXRhID0gdGhpcy5yZWZyZXNoKCk7XG4gIH1cblxuICAvKipcbiAgICogTWFrZXMgYSBmZXRjaCByZXF1ZXN0IHRvIFBDIHJlcXVlc3RpbmcgZGF0YSBzb3VyY2VzLiBJZiBjYWxsZWQgYWZ0ZXIgY2xhc3MgaW5pdGlhbGl6YXRpb24sIHB1cmdlcyBleGlzdGluZyBkYXRhIHNvdXJjZSBjYWNoZSBhbmQgbWFrZXMgYSBjYWxsIHRvIFBDIHRvIHJlLWZldGNoIGRhdGEgc291cmNlcy5cbiAgICogQG1ldGhvZCBkYXRhc291cmNlcyNyZWZyZXNoXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPG9iamVjdD59IC0gUmV0dXJucyBwcm9taXNlIGNvbnRhaW5pbmcgZWl0aGVyIHRoZSBkYXRhIHNvdXJjZSBhcnJheSBvciBudWxsIGlmIGRhdGEgc291cmNlIGlzIG5vdCBhdmFpbGFibGVcbiAgICovXG4gIHJlZnJlc2goKSB7XG4gICAgdmFyIGRhdGFQcm9taXNlID0gdGhpcy5yZXF1ZXN0LmZldGNoKCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHZhciBvdXRwdXQgPSB7fTtcbiAgICAgIGlmIChpc09iamVjdChyZXNwb25zZSkpIHtcbiAgICAgICAgcmVzcG9uc2VcbiAgICAgICAgICAuZmlsdGVyKHNvdXJjZSA9PiBzb3VyY2Uubm90UGF0aHdheURhdGEgPT0gZmFsc2UpXG4gICAgICAgICAgLm1hcCgoZHMpID0+IHtcbiAgICAgICAgICAgIHZhciBuYW1lID0gKGRzLm5hbWUubGVuZ3RoID4gMSkgPyBkcy5uYW1lWzFdIDogZHMubmFtZVswXTtcbiAgICAgICAgICAgIG91dHB1dFtkcy51cmldID0ge1xuICAgICAgICAgICAgICBpZDogZHMuaWRlbnRpZmllcixcbiAgICAgICAgICAgICAgdXJpOiBkcy51cmksXG4gICAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBkcy5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgdHlwZTogZHMudHlwZSxcbiAgICAgICAgICAgICAgaWNvblVybDogZHMuaWNvblVybFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dHB1dCA9IG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pO1xuXG4gICAgdGhpcy5kYXRhID0gZGF0YVByb21pc2U7XG4gICAgcmV0dXJuIGRhdGFQcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgcHJvbWlzZSBjb250YWluaW5nIGRhdGEgc291cmNlcyBmcm9tIFBDLlxuICAgKiBAbWV0aG9kIGRhdGFzb3VyY2VzI2ZldGNoXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPG9iamVjdD59IC0gUmV0dXJucyBjYWNoZWQgcHJvbWlzZSBmcm9tIHRoZSBmZXRjaCBtZXRob2RcbiAgICovXG4gIGZldGNoKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGE7XG4gIH1cblxuICAvKipcbiAgICogRmV0Y2hlcyB0aGUgbG9nbyBmb3IgdGhlIGRhdGFzb3VyY2UgdXNpbmcgZWl0aGVyIGRhdGFzb3VyY2VzIFVSSSBvciBuYW1lLiBJbnRlbmRlZCB0byBiZSB1c2VkIHRvIGdlbmVyYXRlIGltYWdlIHRhZ3MgZm9yIHRodW1ibmFpbHMuXG4gICAqIEBtZXRob2QgZGF0YXNvdXJjZXMjbG9va3VwSWNvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gZHNVcmlPck5hbWUgLSBFaXRoZXIgVVJJIG9yIG5hbWUgb2YgdGhlIGRhdGEgc291cmNlXG4gICAqIEByZXR1cm4ge1Byb21pc2U8c3RyaW5nPn0gbG9nb1VybCAtIFByb21pc2UgY29udGFpbmluZyBVUkwgb2YgZGF0YXNvdXJjZSBpbiBxdWVzdGlvbiwgZWxzZSB1bmRlZmluZWQgaWYgZGF0YXNvdXJjZSBub3QgZm91bmRcbiAgICovXG4gIGxvb2t1cEljb24oZHNVcmlPck5hbWUpIHtcbiAgICBkc1VyaU9yTmFtZSA9IGRzVXJpT3JOYW1lIHx8IFwiXCI7XG4gICAgcmV0dXJuIHRoaXMuZGF0YS50aGVuKChkYXRhU291cmNlcykgPT4ge1xuICAgICAgZm9yICh2YXIga2V5IGluIGRhdGFTb3VyY2VzKSB7XG4gICAgICAgIHZhciBkcyA9IGRhdGFTb3VyY2VzW2tleV07XG4gICAgICAgIGlmIChkcy51cmkgPT0gZHNVcmlPck5hbWUgfHwgZHMubmFtZS50b0xvd2VyQ2FzZSgpID09IGRzVXJpT3JOYW1lLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICByZXR1cm4gZHMuaWNvblVybDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=