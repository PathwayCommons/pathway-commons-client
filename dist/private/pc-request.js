'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var constants = require('./constants.js');

var _fetch = require('fetch-ponyfill')().fetch;
var isEmpty = require('lodash/isEmpty');
var isArray = require('lodash/isArray');
var isObject = require('lodash/isObject');
var stringify = require('query-string').stringify;

var user = require('../user.js');
var validateString = require('./helpers.js').validateString;

/**
 * @class
 * @classdesc Class for use in fetch requests to Pathway Commons
 */
module.exports = function () {
  function PcRequest(commandValue, submitId) {
    _classCallCheck(this, PcRequest);

    if (!validateString(commandValue)) {
      throw new SyntaxError("PcRequest constructor parameter invalid");
    }
    Object.defineProperty(this, "submitId", {
      get: function get() {
        return submitId === false ? false : true;
      }
    });
    Object.defineProperty(this, "command", {
      get: function get() {
        return commandValue;
      }
    });

    this.queryObject = {};
    this.formatString = "";
  }

  _createClass(PcRequest, [{
    key: 'query',
    value: function query(queryObject) {
      if (isObject(queryObject)) {
        this.queryObject = Object.assign({}, queryObject);
      }

      return this;
    }
  }, {
    key: 'set',
    value: function set(parameter, value) {
      parameter = String(parameter);
      if (parameter !== "") {
        if (value === "" || isArray(value) && !isEmpty(value)) {
          this.delete(parameter);
        } else {
          this.queryObject[parameter] = value;
        }
      }

      return this;
    }
  }, {
    key: 'delete',
    value: function _delete(parameter) {
      delete this.queryObject[parameter];

      return this;
    }
  }, {
    key: 'format',
    value: function format(formatString) {
      var acceptedStrings = ["json", "xml", ""];

      if (acceptedStrings.indexOf(formatString) !== -1) {
        this.formatString = formatString;
      }

      return this;
    }
  }, {
    key: 'fetch',
    value: function fetch() {
      var url = constants.pcAddress + this.command + (this.formatString ? "." + this.formatString : "") + "?" + stringify(Object.assign({}, this.queryObject, this.submitId ? {
        user: user.id()
      } : {}));

      return _fetch(url, { method: 'GET', mode: 'no-cors' }).then(function (res) {
        switch (res.status) {
          case 200:
            // To read headers from both node and browser fetch
            var contentType = res.headers._headers ? res.headers._headers["content-type"][0] : res.headers.map["content-type"];
            return contentType.toLowerCase().indexOf("json") !== -1 ? res.json() : res.text();
          case 500:
            return null;
          default:
            throw new Error(res.status);
        }
      });
    }
  }]);

  return PcRequest;
}();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaXZhdGUvcGMtcmVxdWVzdC5qcyJdLCJuYW1lcyI6WyJjb25zdGFudHMiLCJyZXF1aXJlIiwiZmV0Y2giLCJpc0VtcHR5IiwiaXNBcnJheSIsImlzT2JqZWN0Iiwic3RyaW5naWZ5IiwidXNlciIsInZhbGlkYXRlU3RyaW5nIiwibW9kdWxlIiwiZXhwb3J0cyIsImNvbW1hbmRWYWx1ZSIsInN1Ym1pdElkIiwiU3ludGF4RXJyb3IiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImdldCIsInF1ZXJ5T2JqZWN0IiwiZm9ybWF0U3RyaW5nIiwiYXNzaWduIiwicGFyYW1ldGVyIiwidmFsdWUiLCJTdHJpbmciLCJkZWxldGUiLCJhY2NlcHRlZFN0cmluZ3MiLCJpbmRleE9mIiwidXJsIiwicGNBZGRyZXNzIiwiY29tbWFuZCIsImlkIiwibWV0aG9kIiwibW9kZSIsInRoZW4iLCJyZXMiLCJzdGF0dXMiLCJjb250ZW50VHlwZSIsImhlYWRlcnMiLCJfaGVhZGVycyIsIm1hcCIsInRvTG93ZXJDYXNlIiwianNvbiIsInRleHQiLCJFcnJvciJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQUNBLElBQUlBLFlBQVlDLFFBQVEsZ0JBQVIsQ0FBaEI7O0FBRUEsSUFBSUMsU0FBUUQsUUFBUSxnQkFBUixJQUE0QkMsS0FBeEM7QUFDQSxJQUFJQyxVQUFVRixRQUFRLGdCQUFSLENBQWQ7QUFDQSxJQUFJRyxVQUFVSCxRQUFRLGdCQUFSLENBQWQ7QUFDQSxJQUFJSSxXQUFXSixRQUFRLGlCQUFSLENBQWY7QUFDQSxJQUFJSyxZQUFZTCxRQUFRLGNBQVIsRUFBd0JLLFNBQXhDOztBQUVBLElBQUlDLE9BQU9OLFFBQVEsWUFBUixDQUFYO0FBQ0EsSUFBSU8saUJBQWlCUCxRQUFRLGNBQVIsRUFBd0JPLGNBQTdDOztBQUVBOzs7O0FBSUFDLE9BQU9DLE9BQVA7QUFDRSxxQkFBWUMsWUFBWixFQUEwQkMsUUFBMUIsRUFBb0M7QUFBQTs7QUFDbEMsUUFBSSxDQUFFSixlQUFlRyxZQUFmLENBQU4sRUFBcUM7QUFDbkMsWUFBTSxJQUFJRSxXQUFKLENBQWdCLHlDQUFoQixDQUFOO0FBQ0Q7QUFDREMsV0FBT0MsY0FBUCxDQUFzQixJQUF0QixFQUE0QixVQUE1QixFQUF3QztBQUN0Q0MsV0FBSyxlQUFNO0FBQ1QsZUFBUUosYUFBYSxLQUFkLEdBQXVCLEtBQXZCLEdBQStCLElBQXRDO0FBQ0Q7QUFIcUMsS0FBeEM7QUFLQUUsV0FBT0MsY0FBUCxDQUFzQixJQUF0QixFQUE0QixTQUE1QixFQUF1QztBQUNyQ0MsV0FBSyxlQUFNO0FBQ1QsZUFBT0wsWUFBUDtBQUNEO0FBSG9DLEtBQXZDOztBQU1BLFNBQUtNLFdBQUwsR0FBbUIsRUFBbkI7QUFDQSxTQUFLQyxZQUFMLEdBQW9CLEVBQXBCO0FBQ0Q7O0FBbEJIO0FBQUE7QUFBQSwwQkFvQlFELFdBcEJSLEVBb0JxQjtBQUNqQixVQUFJWixTQUFTWSxXQUFULENBQUosRUFBMkI7QUFDekIsYUFBS0EsV0FBTCxHQUFtQkgsT0FBT0ssTUFBUCxDQUFjLEVBQWQsRUFBa0JGLFdBQWxCLENBQW5CO0FBQ0Q7O0FBRUQsYUFBTyxJQUFQO0FBQ0Q7QUExQkg7QUFBQTtBQUFBLHdCQTRCTUcsU0E1Qk4sRUE0QmlCQyxLQTVCakIsRUE0QndCO0FBQ3BCRCxrQkFBWUUsT0FBT0YsU0FBUCxDQUFaO0FBQ0EsVUFBSUEsY0FBYyxFQUFsQixFQUFzQjtBQUNwQixZQUFJQyxVQUFVLEVBQVYsSUFBaUJqQixRQUFRaUIsS0FBUixLQUFrQixDQUFDbEIsUUFBUWtCLEtBQVIsQ0FBeEMsRUFBeUQ7QUFDdkQsZUFBS0UsTUFBTCxDQUFZSCxTQUFaO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsZUFBS0gsV0FBTCxDQUFpQkcsU0FBakIsSUFBOEJDLEtBQTlCO0FBQ0Q7QUFDRjs7QUFFRCxhQUFPLElBQVA7QUFDRDtBQXZDSDtBQUFBO0FBQUEsNEJBeUNTRCxTQXpDVCxFQXlDb0I7QUFDaEIsYUFBTyxLQUFLSCxXQUFMLENBQWlCRyxTQUFqQixDQUFQOztBQUVBLGFBQU8sSUFBUDtBQUNEO0FBN0NIO0FBQUE7QUFBQSwyQkErQ1NGLFlBL0NULEVBK0N1QjtBQUNuQixVQUFNTSxrQkFBa0IsQ0FDdEIsTUFEc0IsRUFFdEIsS0FGc0IsRUFHdEIsRUFIc0IsQ0FBeEI7O0FBTUEsVUFBSUEsZ0JBQWdCQyxPQUFoQixDQUF3QlAsWUFBeEIsTUFBMEMsQ0FBQyxDQUEvQyxFQUFrRDtBQUNoRCxhQUFLQSxZQUFMLEdBQW9CQSxZQUFwQjtBQUNEOztBQUVELGFBQU8sSUFBUDtBQUNEO0FBM0RIO0FBQUE7QUFBQSw0QkE2RFU7QUFDTixVQUFJUSxNQUFNMUIsVUFBVTJCLFNBQVYsR0FBc0IsS0FBS0MsT0FBM0IsSUFBc0MsS0FBS1YsWUFBTCxHQUFvQixNQUFNLEtBQUtBLFlBQS9CLEdBQThDLEVBQXBGLElBQTBGLEdBQTFGLEdBQWdHWixVQUFVUSxPQUFPSyxNQUFQLENBQWMsRUFBZCxFQUFrQixLQUFLRixXQUF2QixFQUFvQyxLQUFLTCxRQUFMLEdBQWdCO0FBQ3RLTCxjQUFNQSxLQUFLc0IsRUFBTDtBQURnSyxPQUFoQixHQUVwSixFQUZnSCxDQUFWLENBQTFHOztBQUlBLGFBQU8zQixPQUFNd0IsR0FBTixFQUFXLEVBQUNJLFFBQVEsS0FBVCxFQUFnQkMsTUFBTSxTQUF0QixFQUFYLEVBQTZDQyxJQUE3QyxDQUFrRCxlQUFPO0FBQzlELGdCQUFRQyxJQUFJQyxNQUFaO0FBQ0UsZUFBSyxHQUFMO0FBQ0U7QUFDQSxnQkFBSUMsY0FBY0YsSUFBSUcsT0FBSixDQUFZQyxRQUFaLEdBQXVCSixJQUFJRyxPQUFKLENBQVlDLFFBQVosQ0FBcUIsY0FBckIsRUFBcUMsQ0FBckMsQ0FBdkIsR0FBaUVKLElBQUlHLE9BQUosQ0FBWUUsR0FBWixDQUFnQixjQUFoQixDQUFuRjtBQUNBLG1CQUFPSCxZQUFZSSxXQUFaLEdBQTBCZCxPQUExQixDQUFrQyxNQUFsQyxNQUE4QyxDQUFDLENBQS9DLEdBQW1EUSxJQUFJTyxJQUFKLEVBQW5ELEdBQWdFUCxJQUFJUSxJQUFKLEVBQXZFO0FBQ0YsZUFBSyxHQUFMO0FBQ0UsbUJBQU8sSUFBUDtBQUNGO0FBQ0Usa0JBQU0sSUFBSUMsS0FBSixDQUFVVCxJQUFJQyxNQUFkLENBQU47QUFSSjtBQVVELE9BWE0sQ0FBUDtBQVlEO0FBOUVIOztBQUFBO0FBQUEiLCJmaWxlIjoicHJpdmF0ZS9wYy1yZXF1ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoJy4vY29uc3RhbnRzLmpzJyk7XG5cbnZhciBmZXRjaCA9IHJlcXVpcmUoJ2ZldGNoLXBvbnlmaWxsJykoKS5mZXRjaDtcbnZhciBpc0VtcHR5ID0gcmVxdWlyZSgnbG9kYXNoL2lzRW1wdHknKTtcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnbG9kYXNoL2lzQXJyYXknKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJ2xvZGFzaC9pc09iamVjdCcpO1xudmFyIHN0cmluZ2lmeSA9IHJlcXVpcmUoJ3F1ZXJ5LXN0cmluZycpLnN0cmluZ2lmeTtcblxudmFyIHVzZXIgPSByZXF1aXJlKCcuLi91c2VyLmpzJyk7XG52YXIgdmFsaWRhdGVTdHJpbmcgPSByZXF1aXJlKCcuL2hlbHBlcnMuanMnKS52YWxpZGF0ZVN0cmluZztcblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgQ2xhc3MgZm9yIHVzZSBpbiBmZXRjaCByZXF1ZXN0cyB0byBQYXRod2F5IENvbW1vbnNcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQY1JlcXVlc3Qge1xuICBjb25zdHJ1Y3Rvcihjb21tYW5kVmFsdWUsIHN1Ym1pdElkKSB7XG4gICAgaWYgKCEodmFsaWRhdGVTdHJpbmcoY29tbWFuZFZhbHVlKSkpIHtcbiAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihcIlBjUmVxdWVzdCBjb25zdHJ1Y3RvciBwYXJhbWV0ZXIgaW52YWxpZFwiKTtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwic3VibWl0SWRcIiwge1xuICAgICAgZ2V0OiAoKSA9PiB7XG4gICAgICAgIHJldHVybiAoc3VibWl0SWQgPT09IGZhbHNlKSA/IGZhbHNlIDogdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJjb21tYW5kXCIsIHtcbiAgICAgIGdldDogKCkgPT4ge1xuICAgICAgICByZXR1cm4gY29tbWFuZFZhbHVlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5xdWVyeU9iamVjdCA9IHt9O1xuICAgIHRoaXMuZm9ybWF0U3RyaW5nID0gXCJcIjtcbiAgfVxuXG4gIHF1ZXJ5KHF1ZXJ5T2JqZWN0KSB7XG4gICAgaWYgKGlzT2JqZWN0KHF1ZXJ5T2JqZWN0KSkge1xuICAgICAgdGhpcy5xdWVyeU9iamVjdCA9IE9iamVjdC5hc3NpZ24oe30sIHF1ZXJ5T2JqZWN0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHNldChwYXJhbWV0ZXIsIHZhbHVlKSB7XG4gICAgcGFyYW1ldGVyID0gU3RyaW5nKHBhcmFtZXRlcik7XG4gICAgaWYgKHBhcmFtZXRlciAhPT0gXCJcIikge1xuICAgICAgaWYgKHZhbHVlID09PSBcIlwiIHx8IChpc0FycmF5KHZhbHVlKSAmJiAhaXNFbXB0eSh2YWx1ZSkpKSB7XG4gICAgICAgIHRoaXMuZGVsZXRlKHBhcmFtZXRlcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnF1ZXJ5T2JqZWN0W3BhcmFtZXRlcl0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGRlbGV0ZShwYXJhbWV0ZXIpIHtcbiAgICBkZWxldGUgdGhpcy5xdWVyeU9iamVjdFtwYXJhbWV0ZXJdO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBmb3JtYXQoZm9ybWF0U3RyaW5nKSB7XG4gICAgY29uc3QgYWNjZXB0ZWRTdHJpbmdzID0gW1xuICAgICAgXCJqc29uXCIsXG4gICAgICBcInhtbFwiLFxuICAgICAgXCJcIlxuICAgIF07XG5cbiAgICBpZiAoYWNjZXB0ZWRTdHJpbmdzLmluZGV4T2YoZm9ybWF0U3RyaW5nKSAhPT0gLTEpIHtcbiAgICAgIHRoaXMuZm9ybWF0U3RyaW5nID0gZm9ybWF0U3RyaW5nO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZmV0Y2goKSB7XG4gICAgdmFyIHVybCA9IGNvbnN0YW50cy5wY0FkZHJlc3MgKyB0aGlzLmNvbW1hbmQgKyAodGhpcy5mb3JtYXRTdHJpbmcgPyBcIi5cIiArIHRoaXMuZm9ybWF0U3RyaW5nIDogXCJcIikgKyBcIj9cIiArIHN0cmluZ2lmeShPYmplY3QuYXNzaWduKHt9LCB0aGlzLnF1ZXJ5T2JqZWN0LCB0aGlzLnN1Ym1pdElkID8ge1xuICAgICAgdXNlcjogdXNlci5pZCgpXG4gICAgfSA6IHt9KSk7XG5cbiAgICByZXR1cm4gZmV0Y2godXJsLCB7bWV0aG9kOiAnR0VUJywgbW9kZTogJ25vLWNvcnMnfSkudGhlbihyZXMgPT4ge1xuICAgICAgc3dpdGNoIChyZXMuc3RhdHVzKSB7XG4gICAgICAgIGNhc2UgMjAwOlxuICAgICAgICAgIC8vIFRvIHJlYWQgaGVhZGVycyBmcm9tIGJvdGggbm9kZSBhbmQgYnJvd3NlciBmZXRjaFxuICAgICAgICAgIHZhciBjb250ZW50VHlwZSA9IHJlcy5oZWFkZXJzLl9oZWFkZXJzID8gcmVzLmhlYWRlcnMuX2hlYWRlcnNbXCJjb250ZW50LXR5cGVcIl1bMF0gOiByZXMuaGVhZGVycy5tYXBbXCJjb250ZW50LXR5cGVcIl07XG4gICAgICAgICAgcmV0dXJuIGNvbnRlbnRUeXBlLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihcImpzb25cIikgIT09IC0xID8gcmVzLmpzb24oKSA6IHJlcy50ZXh0KCk7XG4gICAgICAgIGNhc2UgNTAwOlxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihyZXMuc3RhdHVzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19