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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaXZhdGUvcGMtcmVxdWVzdC5qcyJdLCJuYW1lcyI6WyJjb25zdGFudHMiLCJyZXF1aXJlIiwiZmV0Y2giLCJpc0VtcHR5IiwiaXNBcnJheSIsImlzT2JqZWN0Iiwic3RyaW5naWZ5IiwidXRpbGl0aWVzIiwidmFsaWRhdGVTdHJpbmciLCJtb2R1bGUiLCJleHBvcnRzIiwiY29tbWFuZFZhbHVlIiwic3VibWl0SWQiLCJ1c2VyT3ZlcnJpZGUiLCJTeW50YXhFcnJvciIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZ2V0IiwidXNlciIsInF1ZXJ5T2JqZWN0IiwiZm9ybWF0U3RyaW5nIiwiYXNzaWduIiwicGFyYW1ldGVyIiwidmFsdWUiLCJTdHJpbmciLCJkZWxldGUiLCJhY2NlcHRlZFN0cmluZ3MiLCJpbmRleE9mIiwidXJsIiwicGNBZGRyZXNzIiwiY29tbWFuZCIsIm1ldGhvZCIsIm1vZGUiLCJ0aGVuIiwicmVzIiwic3RhdHVzIiwiY29udGVudFR5cGUiLCJoZWFkZXJzIiwiX2hlYWRlcnMiLCJtYXAiLCJ0b0xvd2VyQ2FzZSIsImpzb24iLCJ0ZXh0IiwiRXJyb3IiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUFDQSxJQUFJQSxZQUFZQyxRQUFRLGdCQUFSLENBQWhCOztBQUVBLElBQUlDLFNBQVFELFFBQVEsZ0JBQVIsSUFBNEJDLEtBQXhDO0FBQ0EsSUFBSUMsVUFBVUYsUUFBUSxnQkFBUixDQUFkO0FBQ0EsSUFBSUcsVUFBVUgsUUFBUSxnQkFBUixDQUFkO0FBQ0EsSUFBSUksV0FBV0osUUFBUSxpQkFBUixDQUFmO0FBQ0EsSUFBSUssWUFBWUwsUUFBUSxjQUFSLEVBQXdCSyxTQUF4Qzs7QUFFQSxJQUFJQyxZQUFZTixRQUFRLGlCQUFSLENBQWhCO0FBQ0EsSUFBSU8saUJBQWlCUCxRQUFRLGNBQVIsRUFBd0JPLGNBQTdDOztBQUVBOzs7O0FBSUFDLE9BQU9DLE9BQVA7QUFDRSxxQkFBWUMsWUFBWixFQUEwQkMsUUFBMUIsRUFBb0NDLFlB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QUFJRyxPQUFKLENBQVlFLEdBQVosQ0FBZ0IsY0FBaEIsQ0FBbkY7QUFDQSxtQkFBT0gsWUFBWUksV0FBWixHQUEwQmIsT0FBMUIsQ0FBa0MsTUFBbEMsTUFBOEMsQ0FBQyxDQUEvQyxHQUFtRE8sSUFBSU8sSUFBSixFQUFuRCxHQUFnRVAsSUFBSVEsSUFBSixFQUF2RTtBQUNGLGVBQUssR0FBTDtBQUNFLG1CQUFPLElBQVA7QUFDRjtBQUNFLGtCQUFNLElBQUlDLEtBQUosQ0FBVVQsSUFBSUMsTUFBZCxDQUFOO0FBUko7QUFVRCxPQVhNLENBQVA7QUFZRDtBQW5GSDs7QUFBQTtBQUFBIiwiZmlsZSI6InByaXZhdGUvcGMtcmVxdWVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcbnZhciBjb25zdGFudHMgPSByZXF1aXJlKCcuL2NvbnN0YW50cy5qcycpO1xuXG52YXIgZmV0Y2ggPSByZXF1aXJlKCdmZXRjaC1wb255ZmlsbCcpKCkuZmV0Y2g7XG52YXIgaXNFbXB0eSA9IHJlcXVpcmUoJ2xvZGFzaC9pc0VtcHR5Jyk7XG52YXIgaXNBcnJheSA9IHJlcXVpcmUoJ2xvZGFzaC9pc0FycmF5Jyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCdsb2Rhc2gvaXNPYmplY3QnKTtcbnZhciBzdHJpbmdpZnkgPSByZXF1aXJlKCdxdWVyeS1zdHJpbmcnKS5zdHJpbmdpZnk7XG5cbnZhciB1dGlsaXRpZXMgPSByZXF1aXJlKCcuLi91dGlsaXRpZXMuanMnKTtcbnZhciB2YWxpZGF0ZVN0cmluZyA9IHJlcXVpcmUoJy4vaGVscGVycy5qcycpLnZhbGlkYXRlU3RyaW5nO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBDbGFzcyBmb3IgdXNlIGluIGZldGNoIHJlcXVlc3RzIHRvIFBhdGh3YXkgQ29tbW9uc1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBjUmVxdWVzdCB7XG4gIGNvbnN0cnVjdG9yKGNvbW1hbmRWYWx1ZSwgc3VibWl0SWQsIHVzZXJPdmVycmlkZSkge1xuICAgIGlmICghKHZhbGlkYXRlU3RyaW5nKGNvbW1hbmRWYWx1ZSkpKSB7XG4gICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJQY1JlcXVlc3QgY29uc3RydWN0b3IgcGFyYW1ldGVyIGludmFsaWRcIik7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcInN1Ym1pdElkXCIsIHtcbiAgICAgIGdldDogKCkgPT4ge1xuICAgICAgICByZXR1cm4gKHN1Ym1pdElkID09PSBmYWxzZSkgPyBmYWxzZSA6IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwiY29tbWFuZFwiLCB7XG4gICAgICBnZXQ6ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIGNvbW1hbmRWYWx1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJ1c2VyXCIsIHtcbiAgICAgIGdldDogKCkgPT4ge1xuICAgICAgICByZXR1cm4gdXNlck92ZXJyaWRlID8gdXNlck92ZXJyaWRlIDogdXRpbGl0aWVzLnVzZXIoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMucXVlcnlPYmplY3QgPSB7fTtcbiAgICB0aGlzLmZvcm1hdFN0cmluZyA9IFwiXCI7XG4gIH1cblxuICBxdWVyeShxdWVyeU9iamVjdCkge1xuICAgIGlmIChpc09iamVjdChxdWVyeU9iamVjdCkpIHtcbiAgICAgIHRoaXMucXVlcnlPYmplY3QgPSBPYmplY3QuYXNzaWduKHt9LCBxdWVyeU9iamVjdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzZXQocGFyYW1ldGVyLCB2YWx1ZSkge1xuICAgIHBhcmFtZXRlciA9IFN0cmluZyhwYXJhbWV0ZXIpO1xuICAgIGlmIChwYXJhbWV0ZXIgIT09IFwiXCIpIHtcbiAgICAgIGlmICh2YWx1ZSA9PT0gXCJcIiB8fCAoaXNBcnJheSh2YWx1ZSkgJiYgIWlzRW1wdHkodmFsdWUpKSkge1xuICAgICAgICB0aGlzLmRlbGV0ZShwYXJhbWV0ZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5xdWVyeU9iamVjdFtwYXJhbWV0ZXJdID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBkZWxldGUocGFyYW1ldGVyKSB7XG4gICAgZGVsZXRlIHRoaXMucXVlcnlPYmplY3RbcGFyYW1ldGVyXTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZm9ybWF0KGZvcm1hdFN0cmluZykge1xuICAgIGNvbnN0IGFjY2VwdGVkU3RyaW5ncyA9IFtcbiAgICAgIFwianNvblwiLFxuICAgICAgXCJ4bWxcIixcbiAgICAgIFwiXCJcbiAgICBdO1xuXG4gICAgaWYgKGFjY2VwdGVkU3RyaW5ncy5pbmRleE9mKGZvcm1hdFN0cmluZykgIT09IC0xKSB7XG4gICAgICB0aGlzLmZvcm1hdFN0cmluZyA9IGZvcm1hdFN0cmluZztcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGZldGNoKCkge1xuICAgIHZhciB1cmwgPSBjb25zdGFudHMucGNBZGRyZXNzICsgdGhpcy5jb21tYW5kICsgKHRoaXMuZm9ybWF0U3RyaW5nID8gXCIuXCIgKyB0aGlzLmZvcm1hdFN0cmluZyA6IFwiXCIpICsgXCI/XCIgKyBzdHJpbmdpZnkoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5xdWVyeU9iamVjdCwgdGhpcy5zdWJtaXRJZCA/IHtcbiAgICAgIHVzZXI6IHRoaXMudXNlclxuICAgIH0gOiB7fSkpO1xuXG4gICAgcmV0dXJuIGZldGNoKHVybCwge21ldGhvZDogJ0dFVCcsIG1vZGU6ICduby1jb3JzJ30pLnRoZW4ocmVzID0+IHtcbiAgICAgIHN3aXRjaCAocmVzLnN0YXR1cykge1xuICAgICAgICBjYXNlIDIwMDpcbiAgICAgICAgICAvLyBUbyByZWFkIGhlYWRlcnMgZnJvbSBib3RoIG5vZGUgYW5kIGJyb3dzZXIgZmV0Y2hcbiAgICAgICAgICB2YXIgY29udGVudFR5cGUgPSByZXMuaGVhZGVycy5faGVhZGVycyA/IHJlcy5oZWFkZXJzLl9oZWFkZXJzW1wiY29udGVudC10eXBlXCJdWzBdIDogcmVzLmhlYWRlcnMubWFwW1wiY29udGVudC10eXBlXCJdO1xuICAgICAgICAgIHJldHVybiBjb250ZW50VHlwZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCJqc29uXCIpICE9PSAtMSA/IHJlcy5qc29uKCkgOiByZXMudGV4dCgpO1xuICAgICAgICBjYXNlIDUwMDpcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IocmVzLnN0YXR1cyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==