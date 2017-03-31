'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var isObject = require('lodash/isObject');

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

    this.request = new PcRequest("metadata/datasources", false);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhdGFzb3VyY2VzLmpzIl0sIm5hbWVzIjpbImlzT2JqZWN0IiwicmVxdWlyZSIsIlBjUmVxdWVzdCIsIm1vZHVsZSIsImV4cG9ydHMiLCJyZXF1ZXN0IiwiZGF0YSIsInJlZnJlc2giLCJkYXRhUHJvbWlzZSIsImZldGNoIiwidGhlbiIsInJlc3BvbnNlIiwib3V0cHV0IiwiZmlsdGVyIiwic291cmNlIiwibm90UGF0aHdheURhdGEiLCJtYXAiLCJkcyIsIm5hbWUiLCJsZW5ndGgiLCJ1cmkiLCJpZCIsImlkZW50aWZpZXIiLCJkZXNjcmlwdGlvbiIsInR5cGUiLCJpY29uVXJsIiwiY2F0Y2giLCJkc1VyaU9yTmFtZSIsImRhdGFTb3VyY2VzIiwia2V5IiwidG9Mb3dlckNhc2UiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUFFQSxJQUFJQSxXQUFXQyxRQUFRLGlCQUFSLENBQWY7O0FBRUEsSUFBSUMsWUFBWUQsUUFBUSx5QkFBUixDQUFoQjs7QUFFQTs7Ozs7QUFLQUUsT0FBT0MsT0FBUDtBQUNFOzs7OztBQUtBLHlCQUFjO0FBQUE7O0FBQ1osU0FBS0MsT0FBTCxHQUFlLElBQUlILFNBQUosQ0FBYyxzQkFBZCxFQUFzQyxLQUF0QyxDQUFmO0FBQ0EsU0FBS0ksSUFBTCxHQUFZLEtBQUtDLE9BQUwsRUFBWjtBQUNEOztBQUVEOzs7Ozs7O0FBWEY7QUFBQTtBQUFBLDhCQWdCWTtBQUNSLFVBQUlDLGNBQWMsS0FBS0gsT0FBTCxDQUFhSSxLQUFiLEdBQXFCQyxJQUFyQixDQUEwQixVQUFDQyxRQUFELEVBQWM7QUFDeEQsWUFBSUMsU0FBUyxFQUFiO0FBQ0EsWUFBSVosU0FBU1csUUFBVCxDQUFKLEVBQXdCO0FBQ3RCQSxtQkFDR0UsTUFESCxDQUNVO0FBQUEsbUJBQVVDLE9BQU9DLGNBQVAsSUFBeUIsS0FBbkM7QUFBQSxXQURWLEVBRUdDLEdBRkgsQ0FFTyxVQUFDQyxFQUFELEVBQVE7QUFDWCxnQkFBSUMsT0FBUUQsR0FBR0MsSUFBSCxDQUFRQyxNQUFSLEdBQWlCLENBQWxCLEdBQXVCRixHQUFHQyxJQUFILENBQVEsQ0FBUixDQUF2QixHQUFvQ0QsR0FBR0MsSUFBSCxDQUFRLENBQVIsQ0FBL0M7QUFDQU4sbUJBQU9LLEdBQUdHLEdBQVYsSUFBaUI7QUFDZkMsa0JBQUlKLEdBQUdLLFVBRFE7QUFFZkYsbUJBQUtILEdBQUdHLEdBRk87QUFHZkYsb0JBQU1BLElBSFM7QUFJZkssMkJBQWFOLEdBQUdNLFdBSkQ7QUFLZkMsb0JBQU1QLEdBQUdPLElBTE07QUFNZkMsdUJBQVNSLEdBQUdRO0FBTkcsYUFBakI7QUFRRCxXQVpIO0FBYUQsU0FkRCxNQWNPO0FBQ0xiLG1CQUFTLElBQVQ7QUFDRDtBQUNELGVBQU9BLE1BQVA7QUFDRCxPQXBCaUIsRUFvQmZjLEtBcEJlLENBb0JULFlBQU07QUFDYixlQUFPLElBQVA7QUFDRCxPQXRCaUIsQ0FBbEI7O0FBd0JBLFdBQUtwQixJQUFMLEdBQVlFLFdBQVo7QUFDQSxhQUFPQSxXQUFQO0FBQ0Q7O0FBRUQ7Ozs7OztBQTdDRjtBQUFBO0FBQUEsNEJBa0RVO0FBQ04sYUFBTyxLQUFLRixJQUFaO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUF0REY7QUFBQTtBQUFBLCtCQTREYXFCLFdBNURiLEVBNEQwQjtBQUN0QkEsb0JBQWNBLGVBQWUsRUFBN0I7QUFDQSxhQUFPLEtBQUtyQixJQUFMLENBQVVJLElBQVYsQ0FBZSxVQUFDa0IsV0FBRCxFQUFpQjtBQUNyQyxhQUFLLElBQUlDLEdBQVQsSUFBZ0JELFdBQWhCLEVBQTZCO0FBQzNCLGNBQUlYLEtBQUtXLFlBQVlDLEdBQVosQ0FBVDtBQUNBLGNBQUlaLEdBQUdHLEdBQUgsSUFBVU8sV0FBVixJQUF5QlYsR0FBR0MsSUFBSCxDQUFRWSxXQUFSLE1BQXlCSCxZQUFZRyxXQUFaLEVBQXRELEVBQWlGO0FBQy9FLG1CQUFPYixHQUFHUSxPQUFWO0FBQ0Q7QUFDRjtBQUNGLE9BUE0sQ0FBUDtBQVFEO0FBdEVIOztBQUFBO0FBQUEiLCJmaWxlIjoiZGF0YXNvdXJjZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJ2xvZGFzaC9pc09iamVjdCcpO1xuXG52YXIgUGNSZXF1ZXN0ID0gcmVxdWlyZSgnLi9wcml2YXRlL3BjLXJlcXVlc3QuanMnKTtcblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgRmV0Y2hlcyBhbiBhcnJheSBvZiBkYXRhc291cmNlcyBmcm9tIFBDLlxuICogQGFsaWFzIGRhdGFzb3VyY2VzXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgRGF0YXNvdXJjZXMge1xuICAvKipcbiAgICogSW5pdGlhbGlzZXMgZGF0YXNvdXJjZXMgYW5kIG1ha2VzIGEgcmVxdWVzdCB0byBQQyBzZXJ2ZXIgZmV0Y2hpbmcgZGF0YXNvdXJjZSBkYXRhLiBDaGFpbmFibGUuXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVxdWVzdCA9IG5ldyBQY1JlcXVlc3QoXCJtZXRhZGF0YS9kYXRhc291cmNlc1wiLCBmYWxzZSk7XG4gICAgdGhpcy5kYXRhID0gdGhpcy5yZWZyZXNoKCk7XG4gIH1cblxuICAvKipcbiAgICogTWFrZXMgYSBmZXRjaCByZXF1ZXN0IHRvIFBDIHJlcXVlc3RpbmcgZGF0YSBzb3VyY2VzLiBJZiBjYWxsZWQgYWZ0ZXIgY2xhc3MgaW5pdGlhbGl6YXRpb24sIHB1cmdlcyBleGlzdGluZyBkYXRhIHNvdXJjZSBjYWNoZSBhbmQgbWFrZXMgYSBjYWxsIHRvIFBDIHRvIHJlLWZldGNoIGRhdGEgc291cmNlcy5cbiAgICogQG1ldGhvZCBkYXRhc291cmNlcyNyZWZyZXNoXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPG9iamVjdD59IC0gUmV0dXJucyBwcm9taXNlIGNvbnRhaW5pbmcgZWl0aGVyIHRoZSBkYXRhIHNvdXJjZSBhcnJheSBvciBudWxsIGlmIGRhdGEgc291cmNlIGlzIG5vdCBhdmFpbGFibGVcbiAgICovXG4gIHJlZnJlc2goKSB7XG4gICAgdmFyIGRhdGFQcm9taXNlID0gdGhpcy5yZXF1ZXN0LmZldGNoKCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHZhciBvdXRwdXQgPSB7fTtcbiAgICAgIGlmIChpc09iamVjdChyZXNwb25zZSkpIHtcbiAgICAgICAgcmVzcG9uc2VcbiAgICAgICAgICAuZmlsdGVyKHNvdXJjZSA9PiBzb3VyY2Uubm90UGF0aHdheURhdGEgPT0gZmFsc2UpXG4gICAgICAgICAgLm1hcCgoZHMpID0+IHtcbiAgICAgICAgICAgIHZhciBuYW1lID0gKGRzLm5hbWUubGVuZ3RoID4gMSkgPyBkcy5uYW1lWzFdIDogZHMubmFtZVswXTtcbiAgICAgICAgICAgIG91dHB1dFtkcy51cmldID0ge1xuICAgICAgICAgICAgICBpZDogZHMuaWRlbnRpZmllcixcbiAgICAgICAgICAgICAgdXJpOiBkcy51cmksXG4gICAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBkcy5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgdHlwZTogZHMudHlwZSxcbiAgICAgICAgICAgICAgaWNvblVybDogZHMuaWNvblVybFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dHB1dCA9IG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pO1xuXG4gICAgdGhpcy5kYXRhID0gZGF0YVByb21pc2U7XG4gICAgcmV0dXJuIGRhdGFQcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgcHJvbWlzZSBjb250YWluaW5nIGRhdGEgc291cmNlcyBmcm9tIFBDLlxuICAgKiBAbWV0aG9kIGRhdGFzb3VyY2VzI2ZldGNoXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPG9iamVjdD59IC0gUmV0dXJucyBjYWNoZWQgcHJvbWlzZSBmcm9tIHRoZSBmZXRjaCBtZXRob2RcbiAgICovXG4gIGZldGNoKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGE7XG4gIH1cblxuICAvKipcbiAgICogRmV0Y2hlcyB0aGUgbG9nbyBmb3IgdGhlIGRhdGFzb3VyY2UgdXNpbmcgZWl0aGVyIGRhdGFzb3VyY2VzIFVSSSBvciBuYW1lLiBJbnRlbmRlZCB0byBiZSB1c2VkIHRvIGdlbmVyYXRlIGltYWdlIHRhZ3MgZm9yIHRodW1ibmFpbHMuXG4gICAqIEBtZXRob2QgZGF0YXNvdXJjZXMjbG9va3VwSWNvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gZHNVcmlPck5hbWUgLSBFaXRoZXIgVVJJIG9yIG5hbWUgb2YgdGhlIGRhdGEgc291cmNlXG4gICAqIEByZXR1cm4ge1Byb21pc2U8c3RyaW5nPn0gbG9nb1VybCAtIFByb21pc2UgY29udGFpbmluZyBVUkwgb2YgZGF0YXNvdXJjZSBpbiBxdWVzdGlvbiwgZWxzZSB1bmRlZmluZWQgaWYgZGF0YXNvdXJjZSBub3QgZm91bmRcbiAgICovXG4gIGxvb2t1cEljb24oZHNVcmlPck5hbWUpIHtcbiAgICBkc1VyaU9yTmFtZSA9IGRzVXJpT3JOYW1lIHx8IFwiXCI7XG4gICAgcmV0dXJuIHRoaXMuZGF0YS50aGVuKChkYXRhU291cmNlcykgPT4ge1xuICAgICAgZm9yICh2YXIga2V5IGluIGRhdGFTb3VyY2VzKSB7XG4gICAgICAgIHZhciBkcyA9IGRhdGFTb3VyY2VzW2tleV07XG4gICAgICAgIGlmIChkcy51cmkgPT0gZHNVcmlPck5hbWUgfHwgZHMubmFtZS50b0xvd2VyQ2FzZSgpID09IGRzVXJpT3JOYW1lLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICByZXR1cm4gZHMuaWNvblVybDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=