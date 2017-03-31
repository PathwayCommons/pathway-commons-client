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
        this.queryObject = queryObject;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaXZhdGUvcGMtcmVxdWVzdC5qcyJdLCJuYW1lcyI6WyJjb25zdGFudHMiLCJyZXF1aXJlIiwiZmV0Y2giLCJpc0VtcHR5IiwiaXNBcnJheSIsImlzT2JqZWN0Iiwic3RyaW5naWZ5IiwidXNlciIsInZhbGlkYXRlU3RyaW5nIiwibW9kdWxlIiwiZXhwb3J0cyIsImNvbW1hbmRWYWx1ZSIsInN1Ym1pdElkIiwiU3ludGF4RXJyb3IiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImdldCIsInF1ZXJ5T2JqZWN0IiwiZm9ybWF0U3RyaW5nIiwicGFyYW1ldGVyIiwidmFsdWUiLCJTdHJpbmciLCJkZWxldGUiLCJhY2NlcHRlZFN0cmluZ3MiLCJpbmRleE9mIiwidXJsIiwicGNBZGRyZXNzIiwiY29tbWFuZCIsImFzc2lnbiIsImlkIiwibWV0aG9kIiwibW9kZSIsInRoZW4iLCJyZXMiLCJzdGF0dXMiLCJjb250ZW50VHlwZSIsImhlYWRlcnMiLCJfaGVhZGVycyIsIm1hcCIsInRvTG93ZXJDYXNlIiwianNvbiIsInRleHQiLCJFcnJvciJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQUNBLElBQUlBLFlBQVlDLFFBQVEsZ0JBQVIsQ0FBaEI7O0FBRUEsSUFBSUMsU0FBUUQsUUFBUSxnQkFBUixJQUE0QkMsS0FBeEM7QUFDQSxJQUFJQyxVQUFVRixRQUFRLGdCQUFSLENBQWQ7QUFDQSxJQUFJRyxVQUFVSCxRQUFRLGdCQUFSLENBQWQ7QUFDQSxJQUFJSSxXQUFXSixRQUFRLGlCQUFSLENBQWY7QUFDQSxJQUFJSyxZQUFZTCxRQUFRLGNBQVIsRUFBd0JLLFNBQXhDOztBQUVBLElBQUlDLE9BQU9OLFFBQVEsWUFBUixDQUFYO0FBQ0EsSUFBSU8saUJBQWlCUCxRQUFRLGNBQVIsRUFBd0JPLGNBQTdDOztBQUVBOzs7O0FBSUFDLE9BQU9DLE9BQVA7QUFDRSxxQkFBWUMsWUFBWixFQUEwQkMsUUFBMUIsRUFBb0M7QUFBQTs7QUFDbEMsUUFBSSxDQUFFSixlQUFl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RSxrQkFBTSxJQUFJQyxLQUFKLENBQVVULElBQUlDLE1BQWQsQ0FBTjtBQVJKO0FBVUQsT0FYTSxDQUFQO0FBWUQ7QUE5RUg7O0FBQUE7QUFBQSIsImZpbGUiOiJwcml2YXRlL3BjLXJlcXVlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG52YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMuanMnKTtcblxudmFyIGZldGNoID0gcmVxdWlyZSgnZmV0Y2gtcG9ueWZpbGwnKSgpLmZldGNoO1xudmFyIGlzRW1wdHkgPSByZXF1aXJlKCdsb2Rhc2gvaXNFbXB0eScpO1xudmFyIGlzQXJyYXkgPSByZXF1aXJlKCdsb2Rhc2gvaXNBcnJheScpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnbG9kYXNoL2lzT2JqZWN0Jyk7XG52YXIgc3RyaW5naWZ5ID0gcmVxdWlyZSgncXVlcnktc3RyaW5nJykuc3RyaW5naWZ5O1xuXG52YXIgdXNlciA9IHJlcXVpcmUoJy4uL3VzZXIuanMnKTtcbnZhciB2YWxpZGF0ZVN0cmluZyA9IHJlcXVpcmUoJy4vaGVscGVycy5qcycpLnZhbGlkYXRlU3RyaW5nO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBDbGFzcyBmb3IgdXNlIGluIGZldGNoIHJlcXVlc3RzIHRvIFBhdGh3YXkgQ29tbW9uc1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBjUmVxdWVzdCB7XG4gIGNvbnN0cnVjdG9yKGNvbW1hbmRWYWx1ZSwgc3VibWl0SWQpIHtcbiAgICBpZiAoISh2YWxpZGF0ZVN0cmluZyhjb21tYW5kVmFsdWUpKSkge1xuICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiUGNSZXF1ZXN0IGNvbnN0cnVjdG9yIHBhcmFtZXRlciBpbnZhbGlkXCIpO1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJzdWJtaXRJZFwiLCB7XG4gICAgICBnZXQ6ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIChzdWJtaXRJZCA9PT0gZmFsc2UpID8gZmFsc2UgOiB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImNvbW1hbmRcIiwge1xuICAgICAgZ2V0OiAoKSA9PiB7XG4gICAgICAgIHJldHVybiBjb21tYW5kVmFsdWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLnF1ZXJ5T2JqZWN0ID0ge307XG4gICAgdGhpcy5mb3JtYXRTdHJpbmcgPSBcIlwiO1xuICB9XG5cbiAgcXVlcnkocXVlcnlPYmplY3QpIHtcbiAgICBpZiAoaXNPYmplY3QocXVlcnlPYmplY3QpKSB7XG4gICAgICB0aGlzLnF1ZXJ5T2JqZWN0ID0gcXVlcnlPYmplY3Q7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzZXQocGFyYW1ldGVyLCB2YWx1ZSkge1xuICAgIHBhcmFtZXRlciA9IFN0cmluZyhwYXJhbWV0ZXIpO1xuICAgIGlmIChwYXJhbWV0ZXIgIT09IFwiXCIpIHtcbiAgICAgIGlmICh2YWx1ZSA9PT0gXCJcIiB8fCAoaXNBcnJheSh2YWx1ZSkgJiYgIWlzRW1wdHkodmFsdWUpKSkge1xuICAgICAgICB0aGlzLmRlbGV0ZShwYXJhbWV0ZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5xdWVyeU9iamVjdFtwYXJhbWV0ZXJdID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBkZWxldGUocGFyYW1ldGVyKSB7XG4gICAgZGVsZXRlIHRoaXMucXVlcnlPYmplY3RbcGFyYW1ldGVyXTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZm9ybWF0KGZvcm1hdFN0cmluZykge1xuICAgIGNvbnN0IGFjY2VwdGVkU3RyaW5ncyA9IFtcbiAgICAgIFwianNvblwiLFxuICAgICAgXCJ4bWxcIixcbiAgICAgIFwiXCJcbiAgICBdO1xuXG4gICAgaWYgKGFjY2VwdGVkU3RyaW5ncy5pbmRleE9mKGZvcm1hdFN0cmluZykgIT09IC0xKSB7XG4gICAgICB0aGlzLmZvcm1hdFN0cmluZyA9IGZvcm1hdFN0cmluZztcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGZldGNoKCkge1xuICAgIHZhciB1cmwgPSBjb25zdGFudHMucGNBZGRyZXNzICsgdGhpcy5jb21tYW5kICsgKHRoaXMuZm9ybWF0U3RyaW5nID8gXCIuXCIgKyB0aGlzLmZvcm1hdFN0cmluZyA6IFwiXCIpICsgXCI/XCIgKyBzdHJpbmdpZnkoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5xdWVyeU9iamVjdCwgdGhpcy5zdWJtaXRJZCA/IHtcbiAgICAgIHVzZXI6IHVzZXIuaWQoKVxuICAgIH0gOiB7fSkpO1xuXG4gICAgcmV0dXJuIGZldGNoKHVybCwge21ldGhvZDogJ0dFVCcsIG1vZGU6ICduby1jb3JzJ30pLnRoZW4ocmVzID0+IHtcbiAgICAgIHN3aXRjaCAocmVzLnN0YXR1cykge1xuICAgICAgICBjYXNlIDIwMDpcbiAgICAgICAgICAvLyBUbyByZWFkIGhlYWRlcnMgZnJvbSBib3RoIG5vZGUgYW5kIGJyb3dzZXIgZmV0Y2hcbiAgICAgICAgICB2YXIgY29udGVudFR5cGUgPSByZXMuaGVhZGVycy5faGVhZGVycyA/IHJlcy5oZWFkZXJzLl9oZWFkZXJzW1wiY29udGVudC10eXBlXCJdWzBdIDogcmVzLmhlYWRlcnMubWFwW1wiY29udGVudC10eXBlXCJdO1xuICAgICAgICAgIHJldHVybiBjb250ZW50VHlwZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCJqc29uXCIpICE9PSAtMSA/IHJlcy5qc29uKCkgOiByZXMudGV4dCgpO1xuICAgICAgICBjYXNlIDUwMDpcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IocmVzLnN0YXR1cyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==