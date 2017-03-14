'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
    Object.defineProperty(this, "pcUrl", {
      get: function get() {
        return "http://www.pathwaycommons.org/pc2/";
      }
    });
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
      var url = this.pcUrl + this.command + (this.formatString ? "." + this.formatString : "") + "?" + stringify(Object.assign({}, this.queryObject, this.submitId ? {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaXZhdGUvcGMtcmVxdWVzdC5qcyJdLCJuYW1lcyI6WyJmZXRjaCIsInJlcXVpcmUiLCJpc0VtcHR5IiwiaXNBcnJheSIsImlzT2JqZWN0Iiwic3RyaW5naWZ5IiwidXNlciIsInZhbGlkYXRlU3RyaW5nIiwibW9kdWxlIiwiZXhwb3J0cyIsImNvbW1hbmRWYWx1ZSIsInN1Ym1pdElkIiwiU3ludGF4RXJyb3IiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImdldCIsInF1ZXJ5T2JqZWN0IiwiZm9ybWF0U3RyaW5nIiwicGFyYW1ldGVyIiwidmFsdWUiLCJTdHJpbmciLCJkZWxldGUiLCJhY2NlcHRlZFN0cmluZ3MiLCJpbmRleE9mIiwidXJsIiwicGNVcmwiLCJjb21tYW5kIiwiYXNzaWduIiwiaWQiLCJtZXRob2QiLCJtb2RlIiwidGhlbiIsInJlcyIsInN0YXR1cyIsImNvbnRlbnRUeXBlIiwiaGVhZGVycyIsIl9oZWFkZXJzIiwibWFwIiwidG9Mb3dlckNhc2UiLCJqc29uIiwidGV4dCIsIkVycm9yIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0FBRUEsSUFBSUEsU0FBUUMsUUFBUSxnQkFBUixJQUE0QkQsS0FBeEM7QUFDQSxJQUFJRSxVQUFVRCxRQUFRLGdCQUFSLENBQWQ7QUFDQSxJQUFJRSxVQUFVRixRQUFRLGdCQUFSLENBQWQ7QUFDQSxJQUFJRyxXQUFXSCxRQUFRLGlCQUFSLENBQWY7QUFDQSxJQUFJSSxZQUFZSixRQUFRLGNBQVIsRUFBd0JJLFNBQXhDOztBQUVBLElBQUlDLE9BQU9MLFFBQVEsWUFBUixDQUFYO0FBQ0EsSUFBSU0saUJBQWlCTixRQUFRLGNBQVIsRUFBd0JNLGNBQTdDOztBQUVBOzs7O0FBSUFDLE9BQU9DLE9BQVA7QUFDRSxxQkFBWUMsWUFBWixFQUEwQkMsUUFBMUIsRUFBb0M7QUFBQTs7QUFDbEMsUUFBSSxDQUFFSixlQUFlRyxZQUFmLENBQU4sRUFBcUM7QUFDbkMsWUFBTSxJQUFJRSxXQUFKLENBQWdCLHlDQUFo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dkU7QUFDRixlQUFLLEdBQUw7QUFDRSxtQkFBTyxJQUFQO0FBQ0Y7QUFDRSxrQkFBTSxJQUFJQyxLQUFKLENBQVVULElBQUlDLE1BQWQsQ0FBTjtBQVJKO0FBVUQsT0FYTSxDQUFQO0FBWUQ7QUFuRkg7O0FBQUE7QUFBQSIsImZpbGUiOiJwcml2YXRlL3BjLXJlcXVlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBmZXRjaCA9IHJlcXVpcmUoJ2ZldGNoLXBvbnlmaWxsJykoKS5mZXRjaDtcbnZhciBpc0VtcHR5ID0gcmVxdWlyZSgnbG9kYXNoL2lzRW1wdHknKTtcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnbG9kYXNoL2lzQXJyYXknKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJ2xvZGFzaC9pc09iamVjdCcpO1xudmFyIHN0cmluZ2lmeSA9IHJlcXVpcmUoJ3F1ZXJ5LXN0cmluZycpLnN0cmluZ2lmeTtcblxudmFyIHVzZXIgPSByZXF1aXJlKCcuLi91c2VyLmpzJyk7XG52YXIgdmFsaWRhdGVTdHJpbmcgPSByZXF1aXJlKCcuL2hlbHBlcnMuanMnKS52YWxpZGF0ZVN0cmluZztcblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgQ2xhc3MgZm9yIHVzZSBpbiBmZXRjaCByZXF1ZXN0cyB0byBQYXRod2F5IENvbW1vbnNcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQY1JlcXVlc3Qge1xuICBjb25zdHJ1Y3Rvcihjb21tYW5kVmFsdWUsIHN1Ym1pdElkKSB7XG4gICAgaWYgKCEodmFsaWRhdGVTdHJpbmcoY29tbWFuZFZhbHVlKSkpIHtcbiAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihcIlBjUmVxdWVzdCBjb25zdHJ1Y3RvciBwYXJhbWV0ZXIgaW52YWxpZFwiKTtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwicGNVcmxcIiwge1xuICAgICAgZ2V0OiAoKSA9PiB7XG4gICAgICAgIHJldHVybiBcImh0dHA6Ly93d3cucGF0aHdheWNvbW1vbnMub3JnL3BjMi9cIjtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJzdWJtaXRJZFwiLCB7XG4gICAgICBnZXQ6ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIChzdWJtaXRJZCA9PT0gZmFsc2UpID8gZmFsc2UgOiB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImNvbW1hbmRcIiwge1xuICAgICAgZ2V0OiAoKSA9PiB7XG4gICAgICAgIHJldHVybiBjb21tYW5kVmFsdWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLnF1ZXJ5T2JqZWN0ID0ge307XG4gICAgdGhpcy5mb3JtYXRTdHJpbmcgPSBcIlwiO1xuICB9XG5cbiAgcXVlcnkocXVlcnlPYmplY3QpIHtcbiAgICBpZiAoaXNPYmplY3QocXVlcnlPYmplY3QpKSB7XG4gICAgICB0aGlzLnF1ZXJ5T2JqZWN0ID0gcXVlcnlPYmplY3Q7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzZXQocGFyYW1ldGVyLCB2YWx1ZSkge1xuICAgIHBhcmFtZXRlciA9IFN0cmluZyhwYXJhbWV0ZXIpO1xuICAgIGlmIChwYXJhbWV0ZXIgIT09IFwiXCIpIHtcbiAgICAgIGlmICh2YWx1ZSA9PT0gXCJcIiB8fCAoaXNBcnJheSh2YWx1ZSkgJiYgIWlzRW1wdHkodmFsdWUpKSkge1xuICAgICAgICB0aGlzLmRlbGV0ZShwYXJhbWV0ZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5xdWVyeU9iamVjdFtwYXJhbWV0ZXJdID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBkZWxldGUocGFyYW1ldGVyKSB7XG4gICAgZGVsZXRlIHRoaXMucXVlcnlPYmplY3RbcGFyYW1ldGVyXTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZm9ybWF0KGZvcm1hdFN0cmluZykge1xuICAgIGNvbnN0IGFjY2VwdGVkU3RyaW5ncyA9IFtcbiAgICAgIFwianNvblwiLFxuICAgICAgXCJ4bWxcIixcbiAgICAgIFwiXCJcbiAgICBdO1xuXG4gICAgaWYgKGFjY2VwdGVkU3RyaW5ncy5pbmRleE9mKGZvcm1hdFN0cmluZykgIT09IC0xKSB7XG4gICAgICB0aGlzLmZvcm1hdFN0cmluZyA9IGZvcm1hdFN0cmluZztcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGZldGNoKCkge1xuICAgIHZhciB1cmwgPSB0aGlzLnBjVXJsICsgdGhpcy5jb21tYW5kICsgKHRoaXMuZm9ybWF0U3RyaW5nID8gXCIuXCIgKyB0aGlzLmZvcm1hdFN0cmluZyA6IFwiXCIpICsgXCI/XCIgKyBzdHJpbmdpZnkoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5xdWVyeU9iamVjdCwgdGhpcy5zdWJtaXRJZCA/IHtcbiAgICAgIHVzZXI6IHVzZXIuaWQoKVxuICAgIH0gOiB7fSkpO1xuXG4gICAgcmV0dXJuIGZldGNoKHVybCwge21ldGhvZDogJ0dFVCcsIG1vZGU6ICduby1jb3JzJ30pLnRoZW4ocmVzID0+IHtcbiAgICAgIHN3aXRjaCAocmVzLnN0YXR1cykge1xuICAgICAgICBjYXNlIDIwMDpcbiAgICAgICAgICAvLyBUbyByZWFkIGhlYWRlcnMgZnJvbSBib3RoIG5vZGUgYW5kIGJyb3dzZXIgZmV0Y2hcbiAgICAgICAgICB2YXIgY29udGVudFR5cGUgPSByZXMuaGVhZGVycy5faGVhZGVycyA/IHJlcy5oZWFkZXJzLl9oZWFkZXJzW1wiY29udGVudC10eXBlXCJdWzBdIDogcmVzLmhlYWRlcnMubWFwW1wiY29udGVudC10eXBlXCJdO1xuICAgICAgICAgIHJldHVybiBjb250ZW50VHlwZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCJqc29uXCIpICE9PSAtMSA/IHJlcy5qc29uKCkgOiByZXMudGV4dCgpO1xuICAgICAgICBjYXNlIDUwMDpcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IocmVzLnN0YXR1cyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==