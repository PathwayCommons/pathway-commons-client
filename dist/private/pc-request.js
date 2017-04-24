'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var constants = require('./constants.js');

var _fetch = require('fetch-ponyfill')().fetch;
var isEmpty = require('lodash/isEmpty');
var isArray = require('lodash/isArray');
var isObject = require('lodash/isObject');
var stringify = require('query-string').stringify;

var utilities = require('../utilities.js');
var validateString = require('./helpers.js').validateString;

/**
 * @class
 * @classdesc Class for use in fetch requests to Pathway Commons
 */
module.exports = function () {
  function PcRequest(commandValue, submitId, userOverride) {
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
    Object.defineProperty(this, "user", {
      get: function get() {
        return userOverride ? userOverride : utilities.user();
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
        if (value === "" || isArray(value) && isEmpty(value)) {
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
        user: this.user
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaXZhdGUvcGMtcmVxdWVzdC5qcyJdLCJuYW1lcyI6WyJjb25zdGFudHMiLCJyZXF1aXJlIiwiZmV0Y2giLCJpc0VtcHR5IiwiaXNBcnJheSIsImlzT2JqZWN0Iiwic3RyaW5naWZ5IiwidXRpbGl0aWVzIiwidmFsaWRhdGVTdHJpbmciLCJtb2R1bGUiLCJleHBvcnRzIiwiY29tbWFuZFZhbHVlIiwic3VibWl0SWQiLCJ1c2VyT3ZlcnJpZGUiLCJTeW50YXhFcnJvciIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZ2V0IiwidXNlciIsInF1ZXJ5T2JqZWN0IiwiZm9ybWF0U3RyaW5nIiwiYXNzaWduIiwicGFyYW1ldGVyIiwidmFsdWUiLCJTdHJpbmciLCJkZWxldGUiLCJhY2NlcHRlZFN0cmluZ3MiLCJpbmRleE9mIiwidXJsIiwicGNBZGRyZXNzIiwiY29tbWFuZCIsIm1ldGhvZCIsIm1vZGUiLCJ0aGVuIiwicmVzIiwic3RhdHVzIiwiY29udGVudFR5cGUiLCJoZWFkZXJzIiwiX2hlYWRlcnMiLCJtYXAiLCJ0b0xvd2VyQ2FzZSIsImpzb24iLCJ0ZXh0IiwiRXJyb3IiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUFDQSxJQUFJQSxZQUFZQyxRQUFRLGdCQUFSLENBQWhCOztBQUVBLElBQUlDLFNBQVFELFFBQVEsZ0JBQVIsSUFBNEJDLEtBQXhDO0FBQ0EsSUFBSUMsVUFBVUYsUUFBUSxnQkFBUixDQUFkO0FBQ0EsSUFBSUcsVUFBVUgsUUFBUSxnQkFBUixDQUFkO0FBQ0EsSUFBSUksV0FBV0osUUFBUSxpQkFBUixDQUFmO0FBQ0EsSUFBSUssWUFBWUwsUUFBUSxjQUFSLEVBQXdCSyxTQUF4Qzs7QUFFQSxJQUFJQyxZQUFZTixRQUFRLGlCQUFSLENBQWhCO0FBQ0EsSUFBSU8saUJBQWlCUCxRQUFRLGNBQVIsRUFBd0JPLGNBQTdDOztBQUVBOzs7O0FBSUFDLE9BQU9DLE9BQVA7QUFDRSxxQkFBWUMsWUFBWixFQUEwQkMsUUFBMUIsRUFBb0NDLFlB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T0FBSixDQUFZRSxHQUFaLENBQWdCLGNBQWhCLENBQW5GO0FBQ0EsbUJBQU9ILFlBQVlJLFdBQVosR0FBMEJiLE9BQTFCLENBQWtDLE1BQWxDLE1BQThDLENBQUMsQ0FBL0MsR0FBbURPLElBQUlPLElBQUosRUFBbkQsR0FBZ0VQLElBQUlRLElBQUosRUFBdkU7QUFDRixlQUFLLEdBQUw7QUFDRSxtQkFBTyxJQUFQO0FBQ0Y7QUFDRSxrQkFBTSxJQUFJQyxLQUFKLENBQVVULElBQUlDLE1BQWQsQ0FBTjtBQVJKO0FBVUQsT0FYTSxDQUFQO0FBWUQ7QUFuRkg7O0FBQUE7QUFBQSIsImZpbGUiOiJwcml2YXRlL3BjLXJlcXVlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG52YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMuanMnKTtcblxudmFyIGZldGNoID0gcmVxdWlyZSgnZmV0Y2gtcG9ueWZpbGwnKSgpLmZldGNoO1xudmFyIGlzRW1wdHkgPSByZXF1aXJlKCdsb2Rhc2gvaXNFbXB0eScpO1xudmFyIGlzQXJyYXkgPSByZXF1aXJlKCdsb2Rhc2gvaXNBcnJheScpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnbG9kYXNoL2lzT2JqZWN0Jyk7XG52YXIgc3RyaW5naWZ5ID0gcmVxdWlyZSgncXVlcnktc3RyaW5nJykuc3RyaW5naWZ5O1xuXG52YXIgdXRpbGl0aWVzID0gcmVxdWlyZSgnLi4vdXRpbGl0aWVzLmpzJyk7XG52YXIgdmFsaWRhdGVTdHJpbmcgPSByZXF1aXJlKCcuL2hlbHBlcnMuanMnKS52YWxpZGF0ZVN0cmluZztcblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgQ2xhc3MgZm9yIHVzZSBpbiBmZXRjaCByZXF1ZXN0cyB0byBQYXRod2F5IENvbW1vbnNcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQY1JlcXVlc3Qge1xuICBjb25zdHJ1Y3Rvcihjb21tYW5kVmFsdWUsIHN1Ym1pdElkLCB1c2VyT3ZlcnJpZGUpIHtcbiAgICBpZiAoISh2YWxpZGF0ZVN0cmluZyhjb21tYW5kVmFsdWUpKSkge1xuICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiUGNSZXF1ZXN0IGNvbnN0cnVjdG9yIHBhcmFtZXRlciBpbnZhbGlkXCIpO1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJzdWJtaXRJZFwiLCB7XG4gICAgICBnZXQ6ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIChzdWJtaXRJZCA9PT0gZmFsc2UpID8gZmFsc2UgOiB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImNvbW1hbmRcIiwge1xuICAgICAgZ2V0OiAoKSA9PiB7XG4gICAgICAgIHJldHVybiBjb21tYW5kVmFsdWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwidXNlclwiLCB7XG4gICAgICBnZXQ6ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHVzZXJPdmVycmlkZSA/IHVzZXJPdmVycmlkZSA6IHV0aWxpdGllcy51c2VyKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLnF1ZXJ5T2JqZWN0ID0ge307XG4gICAgdGhpcy5mb3JtYXRTdHJpbmcgPSBcIlwiO1xuICB9XG5cbiAgcXVlcnkocXVlcnlPYmplY3QpIHtcbiAgICBpZiAoaXNPYmplY3QocXVlcnlPYmplY3QpKSB7XG4gICAgICB0aGlzLnF1ZXJ5T2JqZWN0ID0gT2JqZWN0LmFzc2lnbih7fSwgcXVlcnlPYmplY3QpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc2V0KHBhcmFtZXRlciwgdmFsdWUpIHtcbiAgICBwYXJhbWV0ZXIgPSBTdHJpbmcocGFyYW1ldGVyKTtcbiAgICBpZiAocGFyYW1ldGVyICE9PSBcIlwiKSB7XG4gICAgICBpZiAodmFsdWUgPT09IFwiXCIgfHwgKGlzQXJyYXkodmFsdWUpICYmIGlzRW1wdHkodmFsdWUpKSkge1xuICAgICAgICB0aGlzLmRlbGV0ZShwYXJhbWV0ZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5xdWVyeU9iamVjdFtwYXJhbWV0ZXJdID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBkZWxldGUocGFyYW1ldGVyKSB7XG4gICAgZGVsZXRlIHRoaXMucXVlcnlPYmplY3RbcGFyYW1ldGVyXTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZm9ybWF0KGZvcm1hdFN0cmluZykge1xuICAgIGNvbnN0IGFjY2VwdGVkU3RyaW5ncyA9IFtcbiAgICAgIFwianNvblwiLFxuICAgICAgXCJ4bWxcIixcbiAgICAgIFwiXCJcbiAgICBdO1xuXG4gICAgaWYgKGFjY2VwdGVkU3RyaW5ncy5pbmRleE9mKGZvcm1hdFN0cmluZykgIT09IC0xKSB7XG4gICAgICB0aGlzLmZvcm1hdFN0cmluZyA9IGZvcm1hdFN0cmluZztcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGZldGNoKCkge1xuICAgIHZhciB1cmwgPSBjb25zdGFudHMucGNBZGRyZXNzICsgdGhpcy5jb21tYW5kICsgKHRoaXMuZm9ybWF0U3RyaW5nID8gXCIuXCIgKyB0aGlzLmZvcm1hdFN0cmluZyA6IFwiXCIpICsgXCI/XCIgKyBzdHJpbmdpZnkoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5xdWVyeU9iamVjdCwgdGhpcy5zdWJtaXRJZCA/IHtcbiAgICAgIHVzZXI6IHRoaXMudXNlclxuICAgIH0gOiB7fSkpO1xuXG4gICAgcmV0dXJuIGZldGNoKHVybCwge21ldGhvZDogJ0dFVCcsIG1vZGU6ICduby1jb3JzJ30pLnRoZW4ocmVzID0+IHtcbiAgICAgIHN3aXRjaCAocmVzLnN0YXR1cykge1xuICAgICAgICBjYXNlIDIwMDpcbiAgICAgICAgICAvLyBUbyByZWFkIGhlYWRlcnMgZnJvbSBib3RoIG5vZGUgYW5kIGJyb3dzZXIgZmV0Y2hcbiAgICAgICAgICB2YXIgY29udGVudFR5cGUgPSByZXMuaGVhZGVycy5faGVhZGVycyA/IHJlcy5oZWFkZXJzLl9oZWFkZXJzW1wiY29udGVudC10eXBlXCJdWzBdIDogcmVzLmhlYWRlcnMubWFwW1wiY29udGVudC10eXBlXCJdO1xuICAgICAgICAgIHJldHVybiBjb250ZW50VHlwZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCJqc29uXCIpICE9PSAtMSA/IHJlcy5qc29uKCkgOiByZXMudGV4dCgpO1xuICAgICAgICBjYXNlIDUwMDpcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IocmVzLnN0YXR1cyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==