/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var constants = __webpack_require__(1);

var _fetch = __webpack_require__(3)().fetch;
var isEmpty = __webpack_require__(8);
var isArray = __webpack_require__(9);
var isObject = __webpack_require__(4);
var stringify = __webpack_require__(10).stringify;

var utilities = __webpack_require__(2);
var validateString = __webpack_require__(5).validateString;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9wcml2YXRlL3BjLXJlcXVlc3QuanMiXSwibmFtZXMiOlsiY29uc3RhbnRzIiwicmVxdWlyZSIsImZldGNoIiwiaXNFbXB0eSIsImlzQXJyYXkiLCJpc09iamVjdCIsInN0cmluZ2lmeSIsInV0aWxpdGllcyIsInZhbGlkYXRlU3RyaW5nIiwibW9kdWxlIiwiZXhwb3J0cyIsImNvbW1hbmRWYWx1ZSIsInN1Ym1pdElkIiwidXNlck92ZXJyaWRlIiwiU3ludGF4RXJyb3IiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImdldCIsInVzZXIiLCJxdWVyeU9iamVjdCIsImZvcm1hdFN0cmluZyIsImFzc2lnbiIsInBhcmFtZXRlciIsInZhbHVlIiwiU3RyaW5nIiwiZGVsZXRlIiwiYWNjZXB0ZWRTdHJpbmdzIiwiaW5kZXhPZiIsInVybCIsInBjQWRkcmVzcyIsImNvbW1hbmQiLCJtZXRob2QiLCJtb2RlIiwidGhlbiIsInJlcyIsInN0YXR1cyIsImNvbnRlbnRUeXBlIiwiaGVhZGVycyIsIl9oZWFkZXJzIiwibWFwIiwidG9Mb3dlckNhc2UiLCJqc29uIiwidGV4dCIsIkVycm9yIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0FBQ0EsSUFBSUEsWUFBWUMsUUFBUSxnQkFBUixDQUFoQjs7QUFFQSxJQUFJQyxTQUFRRCxRQUFRLGdCQUFSLElBQTRCQyxLQUF4QztBQUNBLElBQUlDLFVBQVVGLFFBQVEsZ0JBQVIsQ0FBZDtBQUNBLElBQUlHLFVBQVVILFFBQVEsZ0JBQVIsQ0FBZDtBQUNBLElBQUlJLFdBQVdKLFFBQVEsaUJBQVIsQ0FBZjtBQUNBLElBQUlLLFlBQVlMLFFBQVEsY0FBUixFQUF3QkssU0FBeEM7O0FBRUEsSUFBSUMsWUFBWU4sUUFBUSxpQkFBUixDQUFoQjtBQUNBLElBQUlPLGlCQUFpQlAsUUFBUSxjQUFSLEVBQXdCTyxjQUE3Qzs7QUFFQTs7OztBQUlBQyxPQUFPQyxPQUFQO0FBQ0UscUJBQVlDLFlBQVosRUFBMEJDLFFBQTFCLEVBQW9DQyxZQUFwQyxFQUFrRDtBQUFBOztBQUNoRCxRQUFJLENBQUVMLGVBQWVHLFlBQWYsQ0FBTixFQUFxQztBQUNuQyxZQUFNLElBQUlHLFdBQUosQ0FBZ0IseUNBQWhCLENBQU47QUFDRDtBQUNEQyxXQUFPQyxjQUFQLENBQXNCLElBQXRCLEVBQTRCLFVBQTVCLEVBQXdDO0FBQ3RDQyxXQUFLLGVBQU07QUFDVCxlQUFRTCxhQUFhLEtBQWQsR0FBdUIsS0FBdkIsR0FBK0IsSUFBdEM7QUFDRDtBQUhxQyxLQUF4QztBQUtBRyxXQUFPQyxjQUFQLENBQXNCLElBQXRCLEVBQTRCLFNBQTVCLEVBQXVDO0FBQ3JDQyxXQUFLLGVBQU07QUFDVCxlQUFPTixZQUFQO0FBQ0Q7QUFIb0MsS0FBdkM7QUFLQUksV0FBT0MsY0FBUCxDQUFzQixJQUF0QixFQUE0QixNQUE1QixFQUFvQztBQUNsQ0MsV0FBSyxlQUFNO0FBQ1QsZUFBT0osZUFBZUEsWUFBZixHQUE4Qk4sVUFBVVcsSUFBVixFQUFyQztBQUNEO0FBSGlDLEtBQXBDOztBQU1BLFNBQUtDLFdBQUwsR0FBbUIsRUFBbkI7QUFDQSxTQUFLQyxZQUFMLEdBQW9CLEVBQXBCO0FBQ0Q7O0FBdkJIO0FBQUE7QUFBQSwwQkF5QlFELFdBekJSLEVBeUJxQjtBQUNqQixVQUFJZCxTQUFTYyxXQUFULENBQUosRUFBMkI7QUFDekIsYUFBS0EsV0FBTCxHQUFtQkosT0FBT00sTUFBUCxDQUFjLEVBQWQsRUFBa0JGLFdBQWxCLENBQW5CO0FBQ0Q7O0FBRUQsYUFBTyxJQUFQO0FBQ0Q7QUEvQkg7QUFBQTtBQUFBLHdCQWlDTUcsU0FqQ04sRUFpQ2lCQyxLQWpDakIsRUFpQ3dCO0FBQ3BCRCxrQkFBWUUsT0FBT0YsU0FBUCxDQUFaO0FBQ0EsVUFBSUEsY0FBYyxFQUFsQixFQUFzQjtBQUNwQixZQUFJQyxVQUFVLEVBQVYsSUFBaUJuQixRQUFRbUIsS0FBUixLQUFrQnBCLFFBQVFvQixLQUFSLENBQXZDLEVBQXdEO0FBQ3RELGVBQUtFLE1BQUwsQ0FBWUgsU0FBWjtBQUNELFNBRkQsTUFFTztBQUNMLGVBQUtILFdBQUwsQ0FBaUJHLFNBQWpCLElBQThCQyxLQUE5QjtBQUNEO0FBQ0Y7O0FBRUQsYUFBTyxJQUFQO0FBQ0Q7QUE1Q0g7QUFBQTtBQUFBLDRCQThDU0QsU0E5Q1QsRUE4Q29CO0FBQ2hCLGFBQU8sS0FBS0gsV0FBTCxDQUFpQkcsU0FBakIsQ0FBUDs7QUFFQSxhQUFPLElBQVA7QUFDRDtBQWxESDtBQUFBO0FBQUEsMkJBb0RTRixZQXBEVCxFQW9EdUI7QUFDbkIsVUFBTU0sa0JBQWtCLENBQ3RCLE1BRHNCLEVBRXRCLEtBRnNCLEVBR3RCLEVBSHNCLENBQXhCOztBQU1BLFVBQUlBLGdCQUFnQkMsT0FBaEIsQ0FBd0JQLFlBQXhCLE1BQTBDLENBQUMsQ0FBL0MsRUFBa0Q7QUFDaEQsYUFBS0EsWUFBTCxHQUFvQkEsWUFBcEI7QUFDRDs7QUFFRCxhQUFPLElBQVA7QUFDRDtBQWhFSDtBQUFBO0FBQUEsNEJBa0VVO0FBQ04sVUFBSVEsTUFBTTVCLFVBQVU2QixTQUFWLEdBQXNCLEtBQUtDLE9BQTNCLElBQXNDLEtBQUtWLFlBQUwsR0FBb0IsTUFBTSxLQUFLQSxZQUEvQixHQUE4QyxFQUFwRixJQUEwRixHQUExRixHQUFnR2QsVUFBVVMsT0FBT00sTUFBUCxDQUFjLEVBQWQsRUFBa0IsS0FBS0YsV0FBdkIsRUFBb0MsS0FBS1AsUUFBTCxHQUFnQjtBQUN0S00sY0FBTSxLQUFLQTtBQUQySixPQUFoQixHQUVwSixFQUZnSCxDQUFWLENBQTFHOztBQUlBLGFBQU9oQixPQUFNMEIsR0FBTixFQUFXLEVBQUNHLFFBQVEsS0FBVCxFQUFnQkMsTUFBTSxTQUF0QixFQUFYLEVBQTZDQyxJQUE3QyxDQUFrRCxlQUFPO0FBQzlELGdCQUFRQyxJQUFJQyxNQUFaO0FBQ0UsZUFBSyxHQUFMO0FBQ0U7QUFDQSxnQkFBSUMsY0FBY0YsSUFBSUcsT0FBSixDQUFZQyxRQUFaLEdBQXVCSixJQUFJRyxPQUFKLENBQVlDLFFBQVosQ0FBcUIsY0FBckIsRUFBcUMsQ0FBckMsQ0FBdkIsR0FBaUVKLElBQUlHLE9BQUosQ0FBWUUsR0FBWixDQUFnQixjQUFoQixDQUFuRjtBQUNBLG1CQUFPSCxZQUFZSSxXQUFaLEdBQTBCYixPQUExQixDQUFrQyxNQUFsQyxNQUE4QyxDQUFDLENBQS9DLEdBQW1ETyxJQUFJTyxJQUFKLEVBQW5ELEdBQWdFUCxJQUFJUSxJQUFKLEVBQXZFO0FBQ0YsZUFBSyxHQUFMO0FBQ0UsbUJBQU8sSUFBUDtBQUNGO0FBQ0Usa0JBQU0sSUFBSUMsS0FBSixDQUFVVCxJQUFJQyxNQUFkLENBQU47QUFSSjtBQVVELE9BWE0sQ0FBUDtBQVlEO0FBbkZIOztBQUFBO0FBQUEiLCJmaWxlIjoicGMtcmVxdWVzdC5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZHlsYW5mb25nL0RvY3VtZW50cy93b3Jrc3BhY2Uvd29yay9wYy9jcGF0aDItY2xpZW50Iiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoJy4vY29uc3RhbnRzLmpzJyk7XG5cbnZhciBmZXRjaCA9IHJlcXVpcmUoJ2ZldGNoLXBvbnlmaWxsJykoKS5mZXRjaDtcbnZhciBpc0VtcHR5ID0gcmVxdWlyZSgnbG9kYXNoLmlzZW1wdHknKTtcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnbG9kYXNoLmlzYXJyYXknKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJ2xvZGFzaC5pc29iamVjdCcpO1xudmFyIHN0cmluZ2lmeSA9IHJlcXVpcmUoJ3F1ZXJ5LXN0cmluZycpLnN0cmluZ2lmeTtcblxudmFyIHV0aWxpdGllcyA9IHJlcXVpcmUoJy4uL3V0aWxpdGllcy5qcycpO1xudmFyIHZhbGlkYXRlU3RyaW5nID0gcmVxdWlyZSgnLi9oZWxwZXJzLmpzJykudmFsaWRhdGVTdHJpbmc7XG5cbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIENsYXNzIGZvciB1c2UgaW4gZmV0Y2ggcmVxdWVzdHMgdG8gUGF0aHdheSBDb21tb25zXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUGNSZXF1ZXN0IHtcbiAgY29uc3RydWN0b3IoY29tbWFuZFZhbHVlLCBzdWJtaXRJZCwgdXNlck92ZXJyaWRlKSB7XG4gICAgaWYgKCEodmFsaWRhdGVTdHJpbmcoY29tbWFuZFZhbHVlKSkpIHtcbiAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihcIlBjUmVxdWVzdCBjb25zdHJ1Y3RvciBwYXJhbWV0ZXIgaW52YWxpZFwiKTtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwic3VibWl0SWRcIiwge1xuICAgICAgZ2V0OiAoKSA9PiB7XG4gICAgICAgIHJldHVybiAoc3VibWl0SWQgPT09IGZhbHNlKSA/IGZhbHNlIDogdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJjb21tYW5kXCIsIHtcbiAgICAgIGdldDogKCkgPT4ge1xuICAgICAgICByZXR1cm4gY29tbWFuZFZhbHVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcInVzZXJcIiwge1xuICAgICAgZ2V0OiAoKSA9PiB7XG4gICAgICAgIHJldHVybiB1c2VyT3ZlcnJpZGUgPyB1c2VyT3ZlcnJpZGUgOiB1dGlsaXRpZXMudXNlcigpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5xdWVyeU9iamVjdCA9IHt9O1xuICAgIHRoaXMuZm9ybWF0U3RyaW5nID0gXCJcIjtcbiAgfVxuXG4gIHF1ZXJ5KHF1ZXJ5T2JqZWN0KSB7XG4gICAgaWYgKGlzT2JqZWN0KHF1ZXJ5T2JqZWN0KSkge1xuICAgICAgdGhpcy5xdWVyeU9iamVjdCA9IE9iamVjdC5hc3NpZ24oe30sIHF1ZXJ5T2JqZWN0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHNldChwYXJhbWV0ZXIsIHZhbHVlKSB7XG4gICAgcGFyYW1ldGVyID0gU3RyaW5nKHBhcmFtZXRlcik7XG4gICAgaWYgKHBhcmFtZXRlciAhPT0gXCJcIikge1xuICAgICAgaWYgKHZhbHVlID09PSBcIlwiIHx8IChpc0FycmF5KHZhbHVlKSAmJiBpc0VtcHR5KHZhbHVlKSkpIHtcbiAgICAgICAgdGhpcy5kZWxldGUocGFyYW1ldGVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucXVlcnlPYmplY3RbcGFyYW1ldGVyXSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZGVsZXRlKHBhcmFtZXRlcikge1xuICAgIGRlbGV0ZSB0aGlzLnF1ZXJ5T2JqZWN0W3BhcmFtZXRlcl07XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGZvcm1hdChmb3JtYXRTdHJpbmcpIHtcbiAgICBjb25zdCBhY2NlcHRlZFN0cmluZ3MgPSBbXG4gICAgICBcImpzb25cIixcbiAgICAgIFwieG1sXCIsXG4gICAgICBcIlwiXG4gICAgXTtcblxuICAgIGlmIChhY2NlcHRlZFN0cmluZ3MuaW5kZXhPZihmb3JtYXRTdHJpbmcpICE9PSAtMSkge1xuICAgICAgdGhpcy5mb3JtYXRTdHJpbmcgPSBmb3JtYXRTdHJpbmc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBmZXRjaCgpIHtcbiAgICB2YXIgdXJsID0gY29uc3RhbnRzLnBjQWRkcmVzcyArIHRoaXMuY29tbWFuZCArICh0aGlzLmZvcm1hdFN0cmluZyA/IFwiLlwiICsgdGhpcy5mb3JtYXRTdHJpbmcgOiBcIlwiKSArIFwiP1wiICsgc3RyaW5naWZ5KE9iamVjdC5hc3NpZ24oe30sIHRoaXMucXVlcnlPYmplY3QsIHRoaXMuc3VibWl0SWQgPyB7XG4gICAgICB1c2VyOiB0aGlzLnVzZXJcbiAgICB9IDoge30pKTtcblxuICAgIHJldHVybiBmZXRjaCh1cmwsIHttZXRob2Q6ICdHRVQnLCBtb2RlOiAnbm8tY29ycyd9KS50aGVuKHJlcyA9PiB7XG4gICAgICBzd2l0Y2ggKHJlcy5zdGF0dXMpIHtcbiAgICAgICAgY2FzZSAyMDA6XG4gICAgICAgICAgLy8gVG8gcmVhZCBoZWFkZXJzIGZyb20gYm90aCBub2RlIGFuZCBicm93c2VyIGZldGNoXG4gICAgICAgICAgdmFyIGNvbnRlbnRUeXBlID0gcmVzLmhlYWRlcnMuX2hlYWRlcnMgPyByZXMuaGVhZGVycy5faGVhZGVyc1tcImNvbnRlbnQtdHlwZVwiXVswXSA6IHJlcy5oZWFkZXJzLm1hcFtcImNvbnRlbnQtdHlwZVwiXTtcbiAgICAgICAgICByZXR1cm4gY29udGVudFR5cGUudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwianNvblwiKSAhPT0gLTEgPyByZXMuanNvbigpIDogcmVzLnRleHQoKTtcbiAgICAgICAgY2FzZSA1MDA6XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHJlcy5zdGF0dXMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  pcAddress: "https://www.pathwaycommons.org/pc2/",

  idPrefix: "pathwaycommons-js-lib:",

  dsIdValidation: {
    uniprot: function uniprot(id) {
      return (/^([A-N,R-Z][0-9]([A-Z][A-Z, 0-9][A-Z, 0-9][0-9]){1,2})|([O,P,Q][0-9][A-Z, 0-9][A-Z, 0-9][A-Z, 0-9][0-9])(\.\d+)?$/.test(id)
      );
    },
    chebi: function chebi(id) {
      return (/^CHEBI:\d+$/.test(id) && id.length <= "CHEBI:".length + 6
      );
    },
    hgnc: function hgnc(id) {
      return (/^[A-Za-z-0-9_]+(\@)?$/.test(id)
      );
    },
    refseq: function refseq(id) {
      return (/^((AC|AP|NC|NG|NM|NP|NR|NT|NW|XM|XP|XR|YP|ZP)_\d+|(NZ\_[A-Z]{4}\d+))(\.\d+)?$/.test(id)
      );
    },
    keggpathway: function keggpathway(id) {
      return (/^\w{2,4}\d{5}$/.test(id)
      );
    },
    keggdrug: function keggdrug(id) {
      return (/^D\d+$/.test(id)
      );
    },
    smpdb: function smpdb(id) {
      return (/^SMP\d{5}$/.test(id)
      );
    },
    drugbank: function drugbank(id) {
      return (/^DB\d{5}$/.test(id)
      );
    }
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9wcml2YXRlL2NvbnN0YW50cy5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwicGNBZGRyZXNzIiwiaWRQcmVmaXgiLCJkc0lkVmFsaWRhdGlvbiIsInVuaXByb3QiLCJ0ZXN0IiwiaWQiLCJjaGViaSIsImxlbmd0aCIsImhnbmMiLCJyZWZzZXEiLCJrZWdncGF0aHdheSIsImtlZ2dkcnVnIiwic21wZGIiLCJkcnVnYmFuayJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsT0FBT0MsT0FBUCxHQUFpQjtBQUNmQyxhQUFXLHFDQURJOztBQUdmQyxZQUFVLHdCQUhLOztBQUtmQyxrQkFBZ0I7QUFDZEMsYUFBUztBQUFBLGFBQU0scUhBQW9IQyxJQUFwSCxDQUF5SEMsRUFBekg7QUFBTjtBQUFBLEtBREs7QUFFZEMsV0FBTztBQUFBLGFBQU0sZUFBY0YsSUFBZCxDQUFtQkMsRUFBbkIsS0FBMkJBLEdBQUdFLE1BQUgsSUFBYyxTQUFTQSxNQUFULEdBQWtCO0FBQWpFO0FBQUEsS0FGTztBQUdkQyxVQUFNO0FBQUEsYUFBTSx5QkFBd0JKLElBQXhCLENBQTZCQyxFQUE3QjtBQUFOO0FBQUEsS0FIUTtBQUlkSSxZQUFRO0FBQUEsYUFBTSxpRkFBZ0ZMLElBQWhGLENBQXFGQyxFQUFyRjtBQUFOO0FBQUEsS0FKTTtBQUtkSyxpQkFBYTtBQUFBLGFBQU0sa0JBQWlCTixJQUFqQixDQUFzQkMsRUFBdEI7QUFBTjtBQUFBLEtBTEM7QUFNZE0sY0FBVTtBQUFBLGFBQU0sVUFBU1AsSUFBVCxDQUFjQyxFQUFkO0FBQU47QUFBQSxLQU5JO0FBT2RPLFdBQU87QUFBQSxhQUFNLGNBQWFSLElBQWIsQ0FBa0JDLEVBQWxCO0FBQU47QUFBQSxLQVBPO0FBUWRRLGNBQVU7QUFBQSxhQUFNLGFBQVlULElBQVosQ0FBaUJDLEVBQWpCO0FBQU47QUFBQTtBQVJJO0FBTEQsQ0FBakIiLCJmaWxlIjoiY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9keWxhbmZvbmcvRG9jdW1lbnRzL3dvcmtzcGFjZS93b3JrL3BjL2NwYXRoMi1jbGllbnQiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgcGNBZGRyZXNzOiBcImh0dHBzOi8vd3d3LnBhdGh3YXljb21tb25zLm9yZy9wYzIvXCIsXG5cbiAgaWRQcmVmaXg6IFwicGF0aHdheWNvbW1vbnMtanMtbGliOlwiLFxuXG4gIGRzSWRWYWxpZGF0aW9uOiB7XG4gICAgdW5pcHJvdDogaWQgPT4gL14oW0EtTixSLVpdWzAtOV0oW0EtWl1bQS1aLCAwLTldW0EtWiwgMC05XVswLTldKXsxLDJ9KXwoW08sUCxRXVswLTldW0EtWiwgMC05XVtBLVosIDAtOV1bQS1aLCAwLTldWzAtOV0pKFxcLlxcZCspPyQvLnRlc3QoaWQpLFxuICAgIGNoZWJpOiBpZCA9PiAvXkNIRUJJOlxcZCskLy50ZXN0KGlkKSAmJiAoaWQubGVuZ3RoIDw9IChcIkNIRUJJOlwiLmxlbmd0aCArIDYpKSxcbiAgICBoZ25jOiBpZCA9PiAvXltBLVphLXotMC05X10rKFxcQCk/JC8udGVzdChpZCksXG4gICAgcmVmc2VxOiBpZCA9PiAvXigoQUN8QVB8TkN8Tkd8Tk18TlB8TlJ8TlR8Tld8WE18WFB8WFJ8WVB8WlApX1xcZCt8KE5aXFxfW0EtWl17NH1cXGQrKSkoXFwuXFxkKyk/JC8udGVzdChpZCksXG4gICAga2VnZ3BhdGh3YXk6IGlkID0+IC9eXFx3ezIsNH1cXGR7NX0kLy50ZXN0KGlkKSxcbiAgICBrZWdnZHJ1ZzogaWQgPT4gL15EXFxkKyQvLnRlc3QoaWQpLFxuICAgIHNtcGRiOiBpZCA9PiAvXlNNUFxcZHs1fSQvLnRlc3QoaWQpLFxuICAgIGRydWdiYW5rOiBpZCA9PiAvXkRCXFxkezV9JC8udGVzdChpZClcbiAgfVxufTtcbiJdfQ==

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var fetch = __webpack_require__(3)().fetch;
var constants = __webpack_require__(1);

// Declare private variables
var _id;

/**
 * @module utilities
 */
module.exports = {
  /**
   * @param {string} [newId] - If given string, sets a new user ID. If null, turns of user id. Else simply returns current ID.
   * @return {string} id - Current user ID
   */
  user: function user(newId) {
    if (_id === undefined || newId !== undefined) {
      if (typeof newId === "string") {
        newId = constants.idPrefix + newId;
      } else if (newId === null) {
        newId = "";
      } else if (newId === undefined) {
        newId = constants.idPrefix + "default";
      }
      _id = newId;
    }
    return _id;
  },

  /**
   * @param {number} [timeout=1000] Sets length of time before timeout in milliseconds
   * @return {boolean} PC2 Status
   */
  pcCheck: function pcCheck(timeout) {
    // timeout is in milliseconds
    var address = constants.pcAddress + "search?q=p53&user=" + constants.idPrefix + "pcCheck";
    var timeoutValue = Number(timeout != null ? timeout : 0) || 1000; // default timeout is 1000ms
    return new Promise(function (resolve, reject) {
      if (typeof XMLHttpRequest !== "undefined") {
        // Assume browserside: done using xhr because network connections cancellable
        var xhttp = new XMLHttpRequest();
        var timeoutRef = setTimeout(function () {
          xhttp.abort();
          resolve(false);
        }, timeoutValue);
        xhttp.open("GET", address);
        xhttp.onreadystatechange = function () {
          if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
            clearTimeout(timeoutRef);
            resolve(true);
          }
        };
        xhttp.send();
      } else {
        // Assume serverside: done using fetch as ponyfill already available and residual network connections immaterial
        var timeoutRef = setTimeout(function () {
          resolve(false);
        }, timeoutValue);
        fetch(address, {
          method: 'get',
          timeout: timeoutValue
        }).then(function (response) {
          if (response.status === 200) {
            clearTimeout(timeoutRef);
            resolve(true);
          } else {
            clearTimeout(timeoutRef);
            resolve(false);
          }
        }).catch(function (e) {
          clearTimeout(timeoutRef);
          resolve(false);
        });
      }
    });
  },

  /**
   * @param {string} sourceName - Name of source type to validate against (eg. uniprot)
   * @param {string} id - ID to validate
   * @return {boolean} idValidity
   */
  sourceCheck: function sourceCheck(sourceName, id) {
    var checkFunction = constants.dsIdValidation[sourceName.toLowerCase() // Make all lowercase
    .replace(/[^a-zA-Z0-9]/g, "") // Remove any non letter or number symbols
    ];
    if (typeof checkFunction === "function") {
      return checkFunction(id);
    } else {
      throw new SyntaxError(sourceName + " is an invalid source");
    }
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy91dGlsaXRpZXMuanMiXSwibmFtZXMiOlsiZmV0Y2giLCJyZXF1aXJlIiwiY29uc3RhbnRzIiwiX2lkIiwibW9kdWxlIiwiZXhwb3J0cyIsInVzZXIiLCJuZXdJZCIsInVuZGVmaW5lZCIsImlkUHJlZml4IiwicGNDaGVjayIsInRpbWVvdXQiLCJhZGRyZXNzIiwicGNBZGRyZXNzIiwidGltZW91dFZhbHVlIiwiTnVtYmVyIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJYTUxIdHRwUmVxdWVzdCIsInhodHRwIiwidGltZW91dFJlZiIsInNldFRpbWVvdXQiLCJhYm9ydCIsIm9wZW4iLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJyZWFkeVN0YXRlIiwiRE9ORSIsInN0YXR1cyIsImNsZWFyVGltZW91dCIsInNlbmQiLCJtZXRob2QiLCJ0aGVuIiwicmVzcG9uc2UiLCJjYXRjaCIsInNvdXJjZUNoZWNrIiwic291cmNlTmFtZSIsImlkIiwiY2hlY2tGdW5jdGlvbiIsImRzSWRWYWxpZGF0aW9uIiwidG9Mb3dlckNhc2UiLCJyZXBsYWNlIiwiU3ludGF4RXJyb3IiXSwibWFwcGluZ3MiOiJBQUFBOztBQUNBLElBQUlBLFFBQVFDLFFBQVEsZ0JBQVIsSUFBNEJELEtBQXhDO0FBQ0EsSUFBSUUsWUFBWUQsUUFBUSx3QkFBUixDQUFoQjs7QUFFQTtBQUNBLElBQUlFLEdBQUo7O0FBRUE7OztBQUdBQyxPQUFPQyxPQUFQLEdBQWlCO0FBQ2Y7Ozs7QUFJQUMsUUFBTSxjQUFDQyxLQUFELEVBQVc7QUFDZixRQUFHSixRQUFRSyxTQUFSLElBQXFCRCxVQUFVQyxTQUFsQyxFQUE2QztBQUMzQyxVQUFHLE9BQU9ELEtBQVAsS0FBaUIsUUFBcEIsRUFBOEI7QUFDNUJBLGdCQUFRTCxVQUFVTyxRQUFWLEdBQXFCRixLQUE3QjtBQUNELE9BRkQsTUFHSyxJQUFHQSxVQUFVLElBQWIsRUFBbUI7QUFDdEJBLGdCQUFRLEVBQVI7QUFDRCxPQUZJLE1BR0EsSUFBR0EsVUFBVUMsU0FBYixFQUF3QjtBQUMzQkQsZ0JBQVFMLFVBQVVPLFFBQVYsR0FBcUIsU0FBN0I7QUFDRDtBQUNETixZQUFNSSxLQUFOO0FBQ0Q7QUFDRCxXQUFPSixHQUFQO0FBQ0QsR0FuQmM7O0FBcUJmOzs7O0FBSUFPLFdBQVMsaUJBQUNDLE9BQUQsRUFBYTtBQUFFO0FBQ3RCLFFBQUlDLFVBQVVWLFVBQVVXLFNBQVYsR0FBc0Isb0JBQXRCLEdBQTZDWCxVQUFVTyxRQUF2RCxHQUFrRSxTQUFoRjtBQUNBLFFBQUlLLGVBQWVDLE9BQU9KLFdBQVcsSUFBWCxHQUFrQkEsT0FBbEIsR0FBNEIsQ0FBbkMsS0FBeUMsSUFBNUQsQ0FGb0IsQ0FFOEM7QUFDbEUsV0FBTyxJQUFJSyxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3RDLFVBQUksT0FBT0MsY0FBUCxLQUEwQixXQUE5QixFQUEyQztBQUFFO0FBQzNDLFlBQUlDLFFBQVEsSUFBSUQsY0FBSixFQUFaO0FBQ0EsWUFBSUUsYUFBYUMsV0FBVyxZQUFNO0FBQ2hDRixnQkFBTUcsS0FBTjtBQUNBTixrQkFBUSxLQUFSO0FBQ0QsU0FIZ0IsRUFHZEgsWUFIYyxDQUFqQjtBQUlBTSxjQUFNSSxJQUFOLENBQVcsS0FBWCxFQUFrQlosT0FBbEI7QUFDQVEsY0FBTUssa0JBQU4sR0FBMkIsWUFBTTtBQUMvQixjQUFJTCxNQUFNTSxVQUFOLEtBQXFCUCxlQUFlUSxJQUFwQyxJQUE0Q1AsTUFBTVEsTUFBTixLQUFpQixHQUFqRSxFQUFzRTtBQUNwRUMseUJBQWFSLFVBQWI7QUFDQUosb0JBQVEsSUFBUjtBQUNEO0FBQ0YsU0FMRDtBQU1BRyxjQUFNVSxJQUFOO0FBQ0QsT0FkRCxNQWNPO0FBQUU7QUFDUCxZQUFJVCxhQUFhQyxXQUFXLFlBQU07QUFDaENMLGtCQUFRLEtBQVI7QUFDRCxTQUZnQixFQUVkSCxZQUZjLENBQWpCO0FBR0FkLGNBQU1ZLE9BQU4sRUFBZTtBQUNYbUIsa0JBQVEsS0FERztBQUVYcEIsbUJBQVNHO0FBRkUsU0FBZixFQUlHa0IsSUFKSCxDQUlRLG9CQUFZO0FBQ2hCLGNBQUlDLFNBQVNMLE1BQVQsS0FBb0IsR0FBeEIsRUFBNkI7QUFDM0JDLHlCQUFhUixVQUFiO0FBQ0FKLG9CQUFRLElBQVI7QUFDRCxXQUhELE1BR087QUFDTFkseUJBQWFSLFVBQWI7QUFDQUosb0JBQVEsS0FBUjtBQUNEO0FBQ0YsU0FaSCxFQWFHaUIsS0FiSCxDQWFTLGFBQUs7QUFDVkwsdUJBQWFSLFVBQWI7QUFDQUosa0JBQVEsS0FBUjtBQUNELFNBaEJIO0FBaUJEO0FBQ0YsS0FyQ00sQ0FBUDtBQXNDRCxHQWxFYzs7QUFvRWY7Ozs7O0FBS0FrQixlQUFhLHFCQUFDQyxVQUFELEVBQWFDLEVBQWIsRUFBb0I7QUFDL0IsUUFBSUMsZ0JBQWdCcEMsVUFBVXFDLGNBQVYsQ0FDbEJILFdBQ0dJLFdBREgsR0FDaUI7QUFEakIsS0FFR0MsT0FGSCxDQUVXLGVBRlgsRUFFNEIsRUFGNUIsQ0FEa0IsQ0FHYztBQUhkLEtBQXBCO0FBS0EsUUFBSSxPQUFPSCxhQUFQLEtBQXlCLFVBQTdCLEVBQXlDO0FBQ3ZDLGFBQU9BLGNBQWNELEVBQWQsQ0FBUDtBQUNELEtBRkQsTUFFTztBQUNMLFlBQU0sSUFBSUssV0FBSixDQUFnQk4sYUFBYSx1QkFBN0IsQ0FBTjtBQUNEO0FBQ0Y7QUFwRmMsQ0FBakIiLCJmaWxlIjoidXRpbGl0aWVzLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9keWxhbmZvbmcvRG9jdW1lbnRzL3dvcmtzcGFjZS93b3JrL3BjL2NwYXRoMi1jbGllbnQiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG52YXIgZmV0Y2ggPSByZXF1aXJlKCdmZXRjaC1wb255ZmlsbCcpKCkuZmV0Y2g7XG52YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9wcml2YXRlL2NvbnN0YW50cy5qcycpO1xuXG4vLyBEZWNsYXJlIHByaXZhdGUgdmFyaWFibGVzXG52YXIgX2lkO1xuXG4vKipcbiAqIEBtb2R1bGUgdXRpbGl0aWVzXG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtuZXdJZF0gLSBJZiBnaXZlbiBzdHJpbmcsIHNldHMgYSBuZXcgdXNlciBJRC4gSWYgbnVsbCwgdHVybnMgb2YgdXNlciBpZC4gRWxzZSBzaW1wbHkgcmV0dXJucyBjdXJyZW50IElELlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IGlkIC0gQ3VycmVudCB1c2VyIElEXG4gICAqL1xuICB1c2VyOiAobmV3SWQpID0+IHtcbiAgICBpZihfaWQgPT09IHVuZGVmaW5lZCB8fCBuZXdJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZih0eXBlb2YgbmV3SWQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgbmV3SWQgPSBjb25zdGFudHMuaWRQcmVmaXggKyBuZXdJZDtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYobmV3SWQgPT09IG51bGwpIHtcbiAgICAgICAgbmV3SWQgPSBcIlwiO1xuICAgICAgfVxuICAgICAgZWxzZSBpZihuZXdJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG5ld0lkID0gY29uc3RhbnRzLmlkUHJlZml4ICsgXCJkZWZhdWx0XCI7XG4gICAgICB9XG4gICAgICBfaWQgPSBuZXdJZDtcbiAgICB9XG4gICAgcmV0dXJuIF9pZDtcbiAgfSxcblxuICAvKipcbiAgICogQHBhcmFtIHtudW1iZXJ9IFt0aW1lb3V0PTEwMDBdIFNldHMgbGVuZ3RoIG9mIHRpbWUgYmVmb3JlIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IFBDMiBTdGF0dXNcbiAgICovXG4gIHBjQ2hlY2s6ICh0aW1lb3V0KSA9PiB7IC8vIHRpbWVvdXQgaXMgaW4gbWlsbGlzZWNvbmRzXG4gICAgdmFyIGFkZHJlc3MgPSBjb25zdGFudHMucGNBZGRyZXNzICsgXCJzZWFyY2g/cT1wNTMmdXNlcj1cIiArIGNvbnN0YW50cy5pZFByZWZpeCArIFwicGNDaGVja1wiO1xuICAgIHZhciB0aW1lb3V0VmFsdWUgPSBOdW1iZXIodGltZW91dCAhPSBudWxsID8gdGltZW91dCA6IDApIHx8IDEwMDA7IC8vIGRlZmF1bHQgdGltZW91dCBpcyAxMDAwbXNcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCAhPT0gXCJ1bmRlZmluZWRcIikgeyAvLyBBc3N1bWUgYnJvd3NlcnNpZGU6IGRvbmUgdXNpbmcgeGhyIGJlY2F1c2UgbmV0d29yayBjb25uZWN0aW9ucyBjYW5jZWxsYWJsZVxuICAgICAgICB2YXIgeGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgdmFyIHRpbWVvdXRSZWYgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB4aHR0cC5hYm9ydCgpO1xuICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICB9LCB0aW1lb3V0VmFsdWUpO1xuICAgICAgICB4aHR0cC5vcGVuKFwiR0VUXCIsIGFkZHJlc3MpO1xuICAgICAgICB4aHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgaWYgKHhodHRwLnJlYWR5U3RhdGUgPT09IFhNTEh0dHBSZXF1ZXN0LkRPTkUgJiYgeGh0dHAuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0UmVmKTtcbiAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB4aHR0cC5zZW5kKCk7XG4gICAgICB9IGVsc2UgeyAvLyBBc3N1bWUgc2VydmVyc2lkZTogZG9uZSB1c2luZyBmZXRjaCBhcyBwb255ZmlsbCBhbHJlYWR5IGF2YWlsYWJsZSBhbmQgcmVzaWR1YWwgbmV0d29yayBjb25uZWN0aW9ucyBpbW1hdGVyaWFsXG4gICAgICAgIHZhciB0aW1lb3V0UmVmID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgIH0sIHRpbWVvdXRWYWx1ZSk7XG4gICAgICAgIGZldGNoKGFkZHJlc3MsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ2dldCcsXG4gICAgICAgICAgICB0aW1lb3V0OiB0aW1lb3V0VmFsdWVcbiAgICAgICAgICB9KVxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dFJlZik7XG4gICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dFJlZik7XG4gICAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRSZWYpO1xuICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzb3VyY2VOYW1lIC0gTmFtZSBvZiBzb3VyY2UgdHlwZSB0byB2YWxpZGF0ZSBhZ2FpbnN0IChlZy4gdW5pcHJvdClcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkIC0gSUQgdG8gdmFsaWRhdGVcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gaWRWYWxpZGl0eVxuICAgKi9cbiAgc291cmNlQ2hlY2s6IChzb3VyY2VOYW1lLCBpZCkgPT4ge1xuICAgIHZhciBjaGVja0Z1bmN0aW9uID0gY29uc3RhbnRzLmRzSWRWYWxpZGF0aW9uW1xuICAgICAgc291cmNlTmFtZVxuICAgICAgICAudG9Mb3dlckNhc2UoKSAvLyBNYWtlIGFsbCBsb3dlcmNhc2VcbiAgICAgICAgLnJlcGxhY2UoL1teYS16QS1aMC05XS9nLCBcIlwiKSAvLyBSZW1vdmUgYW55IG5vbiBsZXR0ZXIgb3IgbnVtYmVyIHN5bWJvbHNcbiAgICBdO1xuICAgIGlmICh0eXBlb2YgY2hlY2tGdW5jdGlvbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICByZXR1cm4gY2hlY2tGdW5jdGlvbihpZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihzb3VyY2VOYW1lICsgXCIgaXMgYW4gaW52YWxpZCBzb3VyY2VcIik7XG4gICAgfVxuICB9XG59XG4iXX0=

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = fetch-ponyfill;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = lodash.isobject;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var constants = __webpack_require__(1);

module.exports = {
  /**
   * @private
   * @param {string} string - String to be checked
   * @return {boolean} Returns true if input is a non-empty string else returns false
   */
  validateString: function validateString(string) {
    if (typeof string === "string" && string.length !== 0) {
      return true;
    } else {
      return false;
    }
  },

  /**
   * @private
   * @param {string} inputString - String to be checked
   * @return {string} Clean string
   */
  escapeLucene: function escapeLucene(inputString) {
    return inputString.replace(/([\!\*\+\-\&\|\(\)\[\]\{\}\^\~\?\:\/\\"])/g, "\\$1");
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9wcml2YXRlL2hlbHBlcnMuanMiXSwibmFtZXMiOlsiY29uc3RhbnRzIiwicmVxdWlyZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJ2YWxpZGF0ZVN0cmluZyIsInN0cmluZyIsImxlbmd0aCIsImVzY2FwZUx1Y2VuZSIsImlucHV0U3RyaW5nIiwicmVwbGFjZSJdLCJtYXBwaW5ncyI6IkFBQUE7O0FBQ0EsSUFBSUEsWUFBWUMsUUFBUSxnQkFBUixDQUFoQjs7QUFFQUMsT0FBT0MsT0FBUCxHQUFpQjtBQUNmOzs7OztBQUtBQyxrQkFBZ0Isd0JBQUNDLE1BQUQsRUFBWTtBQUMxQixRQUFLLE9BQU9BLE1BQVAsS0FBa0IsUUFBbkIsSUFBaUNBLE9BQU9DLE1BQVAsS0FBa0IsQ0FBdkQsRUFBMkQ7QUFDekQsYUFBTyxJQUFQO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsYUFBTyxLQUFQO0FBQ0Q7QUFDRixHQVpjOztBQWNmOzs7OztBQUtBQyxnQkFBYyxzQkFBQ0MsV0FBRCxFQUFpQjtBQUM3QixXQUFPQSxZQUFZQyxPQUFaLENBQW9CLDRDQUFwQixFQUFrRSxNQUFsRSxDQUFQO0FBQ0Q7QUFyQmMsQ0FBakIiLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZHlsYW5mb25nL0RvY3VtZW50cy93b3Jrc3BhY2Uvd29yay9wYy9jcGF0aDItY2xpZW50Iiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoJy4vY29uc3RhbnRzLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAvKipcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyAtIFN0cmluZyB0byBiZSBjaGVja2VkXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IFJldHVybnMgdHJ1ZSBpZiBpbnB1dCBpcyBhIG5vbi1lbXB0eSBzdHJpbmcgZWxzZSByZXR1cm5zIGZhbHNlXG4gICAqL1xuICB2YWxpZGF0ZVN0cmluZzogKHN0cmluZykgPT4ge1xuICAgIGlmICgodHlwZW9mIHN0cmluZyA9PT0gXCJzdHJpbmdcIikgJiYgKHN0cmluZy5sZW5ndGggIT09IDApKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlucHV0U3RyaW5nIC0gU3RyaW5nIHRvIGJlIGNoZWNrZWRcbiAgICogQHJldHVybiB7c3RyaW5nfSBDbGVhbiBzdHJpbmdcbiAgICovXG4gIGVzY2FwZUx1Y2VuZTogKGlucHV0U3RyaW5nKSA9PiB7XG4gICAgcmV0dXJuIGlucHV0U3RyaW5nLnJlcGxhY2UoLyhbXFwhXFwqXFwrXFwtXFwmXFx8XFwoXFwpXFxbXFxdXFx7XFx9XFxeXFx+XFw/XFw6XFwvXFxcXFwiXSkvZywgXCJcXFxcJDFcIik7XG4gIH1cbn1cbiJdfQ==

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @fileOverview Pathway Commons Access Library Index
 * @author Manfred Cheung
 * @version: 0.1
 */

module.exports = {
  utilities: __webpack_require__(2),
  datasources: new (__webpack_require__(7))(),
  get: function get() {
    return new (__webpack_require__(11))();
  },
  search: function search() {
    return new (__webpack_require__(12))();
  },
  traverse: function traverse() {
    return new (__webpack_require__(13))();
  },
  graph: function graph() {
    return new (__webpack_require__(14))();
  },
  top_pathways: function top_pathways() {
    return new (__webpack_require__(15))();
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwidXRpbGl0aWVzIiwicmVxdWlyZSIsImRhdGFzb3VyY2VzIiwiZ2V0Iiwic2VhcmNoIiwidHJhdmVyc2UiLCJncmFwaCIsInRvcF9wYXRod2F5cyJdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUE7Ozs7OztBQU1BQSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLGFBQVdDLFFBQVEsZ0JBQVIsQ0FESTtBQUVmQyxlQUFhLEtBQUlELFFBQVEsa0JBQVIsQ0FBSixHQUZFO0FBR2ZFLE9BQU07QUFBQSxXQUFNLEtBQUlGLFFBQVEsVUFBUixDQUFKLEdBQU47QUFBQSxHQUhTO0FBSWZHLFVBQVM7QUFBQSxXQUFNLEtBQUlILFFBQVEsYUFBUixDQUFKLEdBQU47QUFBQSxHQUpNO0FBS2ZJLFlBQVc7QUFBQSxXQUFNLEtBQUlKLFFBQVEsZUFBUixDQUFKLEdBQU47QUFBQSxHQUxJO0FBTWZLLFNBQVE7QUFBQSxXQUFNLEtBQUlMLFFBQVEsWUFBUixDQUFKLEdBQU47QUFBQSxHQU5PO0FBT2ZNLGdCQUFlO0FBQUEsV0FBTSxLQUFJTixRQUFRLG1CQUFSLENBQUosR0FBTjtBQUFBO0FBUEEsQ0FBakIiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2R5bGFuZm9uZy9Eb2N1bWVudHMvd29ya3NwYWNlL3dvcmsvcGMvY3BhdGgyLWNsaWVudCIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAZmlsZU92ZXJ2aWV3IFBhdGh3YXkgQ29tbW9ucyBBY2Nlc3MgTGlicmFyeSBJbmRleFxuICogQGF1dGhvciBNYW5mcmVkIENoZXVuZ1xuICogQHZlcnNpb246IDAuMVxuICovXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICB1dGlsaXRpZXM6IHJlcXVpcmUoJy4vdXRpbGl0aWVzLmpzJyksXG4gIGRhdGFzb3VyY2VzOiBuZXcocmVxdWlyZSgnLi9kYXRhc291cmNlcy5qcycpKSgpLFxuICBnZXQ6ICgoKSA9PiBuZXcocmVxdWlyZSgnLi9nZXQuanMnKSkoKSksXG4gIHNlYXJjaDogKCgpID0+IG5ldyhyZXF1aXJlKCcuL3NlYXJjaC5qcycpKSgpKSxcbiAgdHJhdmVyc2U6ICgoKSA9PiBuZXcocmVxdWlyZSgnLi90cmF2ZXJzZS5qcycpKSgpKSxcbiAgZ3JhcGg6ICgoKSA9PiBuZXcocmVxdWlyZSgnLi9ncmFwaC5qcycpKSgpKSxcbiAgdG9wX3BhdGh3YXlzOiAoKCkgPT4gbmV3KHJlcXVpcmUoJy4vdG9wX3BhdGh3YXlzLmpzJykpKCkpXG59O1xuIl19

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var isObject = __webpack_require__(4);

var constants = __webpack_require__(1);
var PcRequest = __webpack_require__(0);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9kYXRhc291cmNlcy5qcyJdLCJuYW1lcyI6WyJpc09iamVjdCIsInJlcXVpcmUiLCJjb25zdGFudHMiLCJQY1JlcXVlc3QiLCJtb2R1bGUiLCJleHBvcnRzIiwicmVxdWVzdCIsImlkUHJlZml4IiwiZGF0YSIsInJlZnJlc2giLCJkYXRhUHJvbWlzZSIsImZldGNoIiwidGhlbiIsInJlc3BvbnNlIiwib3V0cHV0IiwiZmlsdGVyIiwic291cmNlIiwibm90UGF0aHdheURhdGEiLCJtYXAiLCJkcyIsIm5hbWUiLCJsZW5ndGgiLCJ1cmkiLCJpZCIsImlkZW50aWZpZXIiLCJkZXNjcmlwdGlvbiIsInR5cGUiLCJpY29uVXJsIiwiY2F0Y2giLCJkc1VyaU9yTmFtZSIsImRhdGFTb3VyY2VzIiwia2V5IiwidG9Mb3dlckNhc2UiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUFFQSxJQUFJQSxXQUFXQyxRQUFRLGlCQUFSLENBQWY7O0FBRUEsSUFBSUMsWUFBWUQsUUFBUSx3QkFBUixDQUFoQjtBQUNBLElBQUlFLFlBQVlGLFFBQVEseUJBQVIsQ0FBaEI7O0FBRUE7Ozs7O0FBS0FHLE9BQU9DLE9BQVA7QUFDRTs7Ozs7QUFLQSx5QkFBYztBQUFBOztBQUNaLFNBQUtDLE9BQUwsR0FBZSxJQUFJSCxTQUFKLENBQWMsc0JBQWQsRUFBc0MsS0FBdEMsRUFBNkNELFVBQVVLLFFBQVYsR0FBcUIsYUFBbEUsQ0FBZjtBQUNBLFNBQUtDLElBQUwsR0FBWSxLQUFLQyxPQUFMLEVBQVo7QUFDRDs7QUFFRDs7Ozs7OztBQVhGO0FBQUE7QUFBQSw4QkFnQlk7QUFDUixVQUFJQyxjQUFjLEtBQUtKLE9BQUwsQ0FBYUssS0FBYixHQUFxQkMsSUFBckIsQ0FBMEIsVUFBQ0MsUUFBRCxFQUFjO0FBQ3hELFlBQUlDLFNBQVMsRUFBYjtBQUNBLFlBQUlkLFNBQVNhLFFBQVQsQ0FBSixFQUF3QjtBQUN0QkEsbUJBQ0dFLE1BREgsQ0FDVTtBQUFBLG1CQUFVQyxPQUFPQyxjQUFQLElBQXlCLEtBQW5DO0FBQUEsV0FEVixFQUVHQyxHQUZILENBRU8sVUFBQ0MsRUFBRCxFQUFRO0FBQ1gsZ0JBQUlDLE9BQVFELEdBQUdDLElBQUgsQ0FBUUMsTUFBUixHQUFpQixDQUFsQixHQUF1QkYsR0FBR0MsSUFBSCxDQUFRLENBQVIsQ0FBdkIsR0FBb0NELEdBQUdDLElBQUgsQ0FBUSxDQUFSLENBQS9DO0FBQ0FOLG1CQUFPSyxHQUFHRyxHQUFWLElBQWlCO0FBQ2ZDLGtCQUFJSixHQUFHSyxVQURRO0FBRWZGLG1CQUFLSCxHQUFHRyxHQUZPO0FBR2ZGLG9CQUFNQSxJQUhTO0FBSWZLLDJCQUFhTixHQUFHTSxXQUpEO0FBS2ZDLG9CQUFNUCxHQUFHTyxJQUxNO0FBTWZDLHVCQUFTUixHQUFHUTtBQU5HLGFBQWpCO0FBUUQsV0FaSDtBQWFELFNBZEQsTUFjTztBQUNMYixtQkFBUyxJQUFUO0FBQ0Q7QUFDRCxlQUFPQSxNQUFQO0FBQ0QsT0FwQmlCLEVBb0JmYyxLQXBCZSxDQW9CVCxZQUFNO0FBQ2IsZUFBTyxJQUFQO0FBQ0QsT0F0QmlCLENBQWxCOztBQXdCQSxXQUFLcEIsSUFBTCxHQUFZRSxXQUFaO0FBQ0EsYUFBT0EsV0FBUDtBQUNEOztBQUVEOzs7Ozs7QUE3Q0Y7QUFBQTtBQUFBLDRCQWtEVTtBQUNOLGFBQU8sS0FBS0YsSUFBWjtBQUNEOztBQUVEOzs7Ozs7O0FBdERGO0FBQUE7QUFBQSwrQkE0RGFxQixXQTVEYixFQTREMEI7QUFDdEJBLG9CQUFjQSxlQUFlLEVBQTdCO0FBQ0EsYUFBTyxLQUFLckIsSUFBTCxDQUFVSSxJQUFWLENBQWUsVUFBQ2tCLFdBQUQsRUFBaUI7QUFDckMsYUFBSyxJQUFJQyxHQUFULElBQWdCRCxXQUFoQixFQUE2QjtBQUMzQixjQUFJWCxLQUFLVyxZQUFZQyxHQUFaLENBQVQ7QUFDQSxjQUFJWixHQUFHRyxHQUFILElBQVVPLFdBQVYsSUFBeUJWLEdBQUdDLElBQUgsQ0FBUVksV0FBUixNQUF5QkgsWUFBWUcsV0FBWixFQUF0RCxFQUFpRjtBQUMvRSxtQkFBT2IsR0FBR1EsT0FBVjtBQUNEO0FBQ0Y7QUFDRixPQVBNLENBQVA7QUFRRDtBQXRFSDs7QUFBQTtBQUFBIiwiZmlsZSI6ImRhdGFzb3VyY2VzLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9keWxhbmZvbmcvRG9jdW1lbnRzL3dvcmtzcGFjZS93b3JrL3BjL2NwYXRoMi1jbGllbnQiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJ2xvZGFzaC5pc29iamVjdCcpO1xuXG52YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9wcml2YXRlL2NvbnN0YW50cy5qcycpO1xudmFyIFBjUmVxdWVzdCA9IHJlcXVpcmUoJy4vcHJpdmF0ZS9wYy1yZXF1ZXN0LmpzJyk7XG5cbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIEZldGNoZXMgYW4gYXJyYXkgb2YgZGF0YXNvdXJjZXMgZnJvbSBQQy5cbiAqIEBhbGlhcyBkYXRhc291cmNlc1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIERhdGFzb3VyY2VzIHtcbiAgLyoqXG4gICAqIEluaXRpYWxpc2VzIGRhdGFzb3VyY2VzIGFuZCBtYWtlcyBhIHJlcXVlc3QgdG8gUEMgc2VydmVyIGZldGNoaW5nIGRhdGFzb3VyY2UgZGF0YS4gQ2hhaW5hYmxlLlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlcXVlc3QgPSBuZXcgUGNSZXF1ZXN0KFwibWV0YWRhdGEvZGF0YXNvdXJjZXNcIiwgZmFsc2UsIGNvbnN0YW50cy5pZFByZWZpeCArIFwiZGF0YXNvdXJjZXNcIik7XG4gICAgdGhpcy5kYXRhID0gdGhpcy5yZWZyZXNoKCk7XG4gIH1cblxuICAvKipcbiAgICogTWFrZXMgYSBmZXRjaCByZXF1ZXN0IHRvIFBDIHJlcXVlc3RpbmcgZGF0YSBzb3VyY2VzLiBJZiBjYWxsZWQgYWZ0ZXIgY2xhc3MgaW5pdGlhbGl6YXRpb24sIHB1cmdlcyBleGlzdGluZyBkYXRhIHNvdXJjZSBjYWNoZSBhbmQgbWFrZXMgYSBjYWxsIHRvIFBDIHRvIHJlLWZldGNoIGRhdGEgc291cmNlcy5cbiAgICogQG1ldGhvZCBkYXRhc291cmNlcyNyZWZyZXNoXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPG9iamVjdD59IC0gUmV0dXJucyBwcm9taXNlIGNvbnRhaW5pbmcgZWl0aGVyIHRoZSBkYXRhIHNvdXJjZSBhcnJheSBvciBudWxsIGlmIGRhdGEgc291cmNlIGlzIG5vdCBhdmFpbGFibGVcbiAgICovXG4gIHJlZnJlc2goKSB7XG4gICAgdmFyIGRhdGFQcm9taXNlID0gdGhpcy5yZXF1ZXN0LmZldGNoKCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHZhciBvdXRwdXQgPSB7fTtcbiAgICAgIGlmIChpc09iamVjdChyZXNwb25zZSkpIHtcbiAgICAgICAgcmVzcG9uc2VcbiAgICAgICAgICAuZmlsdGVyKHNvdXJjZSA9PiBzb3VyY2Uubm90UGF0aHdheURhdGEgPT0gZmFsc2UpXG4gICAgICAgICAgLm1hcCgoZHMpID0+IHtcbiAgICAgICAgICAgIHZhciBuYW1lID0gKGRzLm5hbWUubGVuZ3RoID4gMSkgPyBkcy5uYW1lWzFdIDogZHMubmFtZVswXTtcbiAgICAgICAgICAgIG91dHB1dFtkcy51cmldID0ge1xuICAgICAgICAgICAgICBpZDogZHMuaWRlbnRpZmllcixcbiAgICAgICAgICAgICAgdXJpOiBkcy51cmksXG4gICAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBkcy5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgdHlwZTogZHMudHlwZSxcbiAgICAgICAgICAgICAgaWNvblVybDogZHMuaWNvblVybFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dHB1dCA9IG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pO1xuXG4gICAgdGhpcy5kYXRhID0gZGF0YVByb21pc2U7XG4gICAgcmV0dXJuIGRhdGFQcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgcHJvbWlzZSBjb250YWluaW5nIGRhdGEgc291cmNlcyBmcm9tIFBDLlxuICAgKiBAbWV0aG9kIGRhdGFzb3VyY2VzI2ZldGNoXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPG9iamVjdD59IC0gUmV0dXJucyBjYWNoZWQgcHJvbWlzZSBmcm9tIHRoZSBmZXRjaCBtZXRob2RcbiAgICovXG4gIGZldGNoKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGE7XG4gIH1cblxuICAvKipcbiAgICogRmV0Y2hlcyB0aGUgbG9nbyBmb3IgdGhlIGRhdGFzb3VyY2UgdXNpbmcgZWl0aGVyIGRhdGFzb3VyY2VzIFVSSSBvciBuYW1lLiBJbnRlbmRlZCB0byBiZSB1c2VkIHRvIGdlbmVyYXRlIGltYWdlIHRhZ3MgZm9yIHRodW1ibmFpbHMuXG4gICAqIEBtZXRob2QgZGF0YXNvdXJjZXMjbG9va3VwSWNvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gZHNVcmlPck5hbWUgLSBFaXRoZXIgVVJJIG9yIG5hbWUgb2YgdGhlIGRhdGEgc291cmNlXG4gICAqIEByZXR1cm4ge1Byb21pc2U8c3RyaW5nPn0gbG9nb1VybCAtIFByb21pc2UgY29udGFpbmluZyBVUkwgb2YgZGF0YXNvdXJjZSBpbiBxdWVzdGlvbiwgZWxzZSB1bmRlZmluZWQgaWYgZGF0YXNvdXJjZSBub3QgZm91bmRcbiAgICovXG4gIGxvb2t1cEljb24oZHNVcmlPck5hbWUpIHtcbiAgICBkc1VyaU9yTmFtZSA9IGRzVXJpT3JOYW1lIHx8IFwiXCI7XG4gICAgcmV0dXJuIHRoaXMuZGF0YS50aGVuKChkYXRhU291cmNlcykgPT4ge1xuICAgICAgZm9yICh2YXIga2V5IGluIGRhdGFTb3VyY2VzKSB7XG4gICAgICAgIHZhciBkcyA9IGRhdGFTb3VyY2VzW2tleV07XG4gICAgICAgIGlmIChkcy51cmkgPT0gZHNVcmlPck5hbWUgfHwgZHMubmFtZS50b0xvd2VyQ2FzZSgpID09IGRzVXJpT3JOYW1lLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICByZXR1cm4gZHMuaWNvblVybDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = lodash.isempty;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = lodash.isarray;

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = query-string;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PcRequest = __webpack_require__(0);

/**
 * @class
 * @classdesc Peforms a get web query to the Pathway Commons web service
 * @alias get
 */
module.exports = function () {
  /**
   * Initialises get. Chainable.
   * @constructor
   * @returns {this}
   */
  function Get() {
    _classCallCheck(this, Get);

    this.request = new PcRequest("get");
  }

  /**
   * Sets all query parameters which are sent with the get request. Will overwrite existing query settings.
   * @method get#query
   * @param {object} queryObject - Object representing the query parameters to be sent along with the get command.
   * @returns {this}
   */


  _createClass(Get, [{
    key: 'query',
    value: function query(queryObject) {
      this.request.query(queryObject);

      return this;
    }

    /**
     * Sets uri parameter which is to be sent with the get request
     * @method get#uri
     * @param {string} value - uri
     * @returns {this}
     */

  }, {
    key: 'uri',
    value: function uri(value) {
      this.request.set("uri", value);

      return this;
    }

    /**
     * Sets format parameter which is to be sent with the get request
     * @method get#format
     * @param {string} value - format
     * @returns {this}
     */

  }, {
    key: 'format',
    value: function format(value) {
      this.request.set("format", value);

      return this;
    }

    /**
     * Makes a fetch call to the PC API and return results
     * @method get#fetch
     * @return {Promise<string>|Promise<object>} - Promise returning either an object or string depending on format
     */

  }, {
    key: 'fetch',
    value: function fetch() {
      return this.request.fetch();
    }
  }]);

  return Get;
}();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9nZXQuanMiXSwibmFtZXMiOlsiUGNSZXF1ZXN0IiwicmVxdWlyZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJyZXF1ZXN0IiwicXVlcnlPYmplY3QiLCJxdWVyeSIsInZhbHVlIiwic2V0IiwiZmV0Y2giXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUFFQSxJQUFJQSxZQUFZQyxRQUFRLHlCQUFSLENBQWhCOztBQUVBOzs7OztBQUtBQyxPQUFPQyxPQUFQO0FBQ0U7Ozs7O0FBS0EsaUJBQWM7QUFBQTs7QUFDWixTQUFLQyxPQUFMLEdBQWUsSUFBSUosU0FBSixDQUFjLEtBQWQsQ0FBZjtBQUNEOztBQUVEOzs7Ozs7OztBQVZGO0FBQUE7QUFBQSwwQkFnQlFLLFdBaEJSLEVBZ0JxQjtBQUNqQixXQUFLRCxPQUFMLENBQWFFLEtBQWIsQ0FBbUJELFdBQW5COztBQUVBLGFBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7O0FBdEJGO0FBQUE7QUFBQSx3QkE0Qk1FLEtBNUJOLEVBNEJhO0FBQ1QsV0FBS0gsT0FBTCxDQUFhSSxHQUFiLENBQWlCLEtBQWpCLEVBQXdCRCxLQUF4Qjs7QUFFQSxhQUFPLElBQVA7QUFDRDs7QUFFRDs7Ozs7OztBQWxDRjtBQUFBO0FBQUEsMkJBd0NTQSxLQXhDVCxFQXdDZ0I7QUFDWixXQUFLSCxPQUFMLENBQWFJLEdBQWIsQ0FBaUIsUUFBakIsRUFBMkJELEtBQTNCOztBQUVBLGFBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7QUE5Q0Y7QUFBQTtBQUFBLDRCQW1EVTtBQUNOLGFBQU8sS0FBS0gsT0FBTCxDQUFhSyxLQUFiLEVBQVA7QUFDRDtBQXJESDs7QUFBQTtBQUFBIiwiZmlsZSI6ImdldC5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZHlsYW5mb25nL0RvY3VtZW50cy93b3Jrc3BhY2Uvd29yay9wYy9jcGF0aDItY2xpZW50Iiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUGNSZXF1ZXN0ID0gcmVxdWlyZSgnLi9wcml2YXRlL3BjLXJlcXVlc3QuanMnKTtcblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgUGVmb3JtcyBhIGdldCB3ZWIgcXVlcnkgdG8gdGhlIFBhdGh3YXkgQ29tbW9ucyB3ZWIgc2VydmljZVxuICogQGFsaWFzIGdldFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEdldCB7XG4gIC8qKlxuICAgKiBJbml0aWFsaXNlcyBnZXQuIENoYWluYWJsZS5cbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXF1ZXN0ID0gbmV3IFBjUmVxdWVzdChcImdldFwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGFsbCBxdWVyeSBwYXJhbWV0ZXJzIHdoaWNoIGFyZSBzZW50IHdpdGggdGhlIGdldCByZXF1ZXN0LiBXaWxsIG92ZXJ3cml0ZSBleGlzdGluZyBxdWVyeSBzZXR0aW5ncy5cbiAgICogQG1ldGhvZCBnZXQjcXVlcnlcbiAgICogQHBhcmFtIHtvYmplY3R9IHF1ZXJ5T2JqZWN0IC0gT2JqZWN0IHJlcHJlc2VudGluZyB0aGUgcXVlcnkgcGFyYW1ldGVycyB0byBiZSBzZW50IGFsb25nIHdpdGggdGhlIGdldCBjb21tYW5kLlxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIHF1ZXJ5KHF1ZXJ5T2JqZWN0KSB7XG4gICAgdGhpcy5yZXF1ZXN0LnF1ZXJ5KHF1ZXJ5T2JqZWN0KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdXJpIHBhcmFtZXRlciB3aGljaCBpcyB0byBiZSBzZW50IHdpdGggdGhlIGdldCByZXF1ZXN0XG4gICAqIEBtZXRob2QgZ2V0I3VyaVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSB1cmlcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICB1cmkodmFsdWUpIHtcbiAgICB0aGlzLnJlcXVlc3Quc2V0KFwidXJpXCIsIHZhbHVlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgZm9ybWF0IHBhcmFtZXRlciB3aGljaCBpcyB0byBiZSBzZW50IHdpdGggdGhlIGdldCByZXF1ZXN0XG4gICAqIEBtZXRob2QgZ2V0I2Zvcm1hdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSBmb3JtYXRcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBmb3JtYXQodmFsdWUpIHtcbiAgICB0aGlzLnJlcXVlc3Quc2V0KFwiZm9ybWF0XCIsIHZhbHVlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ha2VzIGEgZmV0Y2ggY2FsbCB0byB0aGUgUEMgQVBJIGFuZCByZXR1cm4gcmVzdWx0c1xuICAgKiBAbWV0aG9kIGdldCNmZXRjaFxuICAgKiBAcmV0dXJuIHtQcm9taXNlPHN0cmluZz58UHJvbWlzZTxvYmplY3Q+fSAtIFByb21pc2UgcmV0dXJuaW5nIGVpdGhlciBhbiBvYmplY3Qgb3Igc3RyaW5nIGRlcGVuZGluZyBvbiBmb3JtYXRcbiAgICovXG4gIGZldGNoKCkge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QuZmV0Y2goKTtcbiAgfVxufVxuIl19

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PcRequest = __webpack_require__(0);
var escapeLucene = __webpack_require__(5).escapeLucene;

/**
 * @class
 * @classdesc Peforms a search web query to the Pathway Commons web service
 * @alias search
 */
module.exports = function () {
  /**
   * Initialises search. Chainable.
   * @constructor
   * @param {object} [queryObject] - Object representing the query parameters to be sent along with the search command.
   * @returns {this}
   */
  function Search() {
    _classCallCheck(this, Search);

    this.request = new PcRequest("search").format("json");
  }

  /**
   * Sets all query parameters which are sent with the search request. Will overwrite existing query settings.
   * @method search#query
   * @param {object} queryObject - Object representing the query parameters to be sent along with the search command.
   * @returns {this}
   */


  _createClass(Search, [{
    key: 'query',
    value: function query(queryObject) {
      this.request.query(queryObject);

      return this;
    }

    /**
     * Sets q parameter which is to be sent with the search request
     * @method search#q
     * @param {string} value - uri
     * @returns {this}
     */

  }, {
    key: 'q',
    value: function q(value) {
      this.request.set("q", value);

      return this;
    }

    /**
     * Sets page parameter which is to be sent with the search request
     * @method search#page
     * @param {string} value - page
     * @returns {this}
     */

  }, {
    key: 'page',
    value: function page(value) {
      this.request.set("page", value);

      return this;
    }

    /**
     * Sets datasource parameter which is to be sent with the search request
     * @method search#datasource
     * @param {string|array} value - datasource
     * @returns {this}
     */

  }, {
    key: 'datasource',
    value: function datasource(value) {
      this.request.set("datasource", value);

      return this;
    }

    /**
     * Sets organism parameter which is to be sent with the search request
     * @method search#organism
     * @param {string} value - organism
     * @returns {this}
     */

  }, {
    key: 'organism',
    value: function organism(value) {
      this.request.set("organism", value);

      return this;
    }

    /**
     * Sets type parameter which is to be sent with the search request
     * @method search#type
     * @param {string} value - type
     * @returns {this}
     */

  }, {
    key: 'type',
    value: function type(value) {
      this.request.set("type", value);

      return this;
    }

    /**
     * Escapes whatever value is contained in q at the moment
     * @method search#escape
     * @param {boolean} [toggle=true] - Switches lucene escaping on or off.
     * @returns {this}
     */

  }, {
    key: 'escape',
    value: function escape(toggle) {
      if (toggle === undefined || toggle === true) {
        this.q(escapeLucene(this.request.queryObject.q));
      }

      return this;
    }

    /**
     * Sets format of returned data
     * @method search#format
     * @param {string} formatString
     * @returns {this}
     */

  }, {
    key: 'format',
    value: function format(formatString) {
      this.request.format(formatString);

      return this;
    }

    /**
     * Makes a fetch call to the PC API and return results
     * @method search#fetch
     * @return {Promise<string>|Promise<object>} - Promise returning either an object or string depending on format
     */

  }, {
    key: 'fetch',
    value: function fetch() {
      return this.request.fetch();
    }
  }]);

  return Search;
}();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZWFyY2guanMiXSwibmFtZXMiOlsiUGNSZXF1ZXN0IiwicmVxdWlyZSIsImVzY2FwZUx1Y2VuZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJyZXF1ZXN0IiwiZm9ybWF0IiwicXVlcnlPYmplY3QiLCJxdWVyeSIsInZhbHVlIiwic2V0IiwidG9nZ2xlIiwidW5kZWZpbmVkIiwicSIsImZvcm1hdFN0cmluZyIsImZldGNoIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0FBRUEsSUFBSUEsWUFBWUMsUUFBUSx5QkFBUixDQUFoQjtBQUNBLElBQUlDLGVBQWVELFFBQVEsc0JBQVIsRUFBZ0NDLFlBQW5EOztBQUVBOzs7OztBQUtBQyxPQUFPQyxPQUFQO0FBQ0U7Ozs7OztBQU1BLG9CQUFjO0FBQUE7O0FBQ1osU0FBS0MsT0FBTCxHQUFlLElBQUlMLFNBQUosQ0FBYyxRQUFkLEVBQXdCTSxNQUF4QixDQUErQixNQUEvQixDQUFmO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O0FBWEY7QUFBQTtBQUFBLDBCQWlCUUMsV0FqQlIsRUFpQnFCO0FBQ2pCLFdBQUtGLE9BQUwsQ0FBYUcsS0FBYixDQUFtQkQsV0FBbkI7O0FBRUEsYUFBTyxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUF2QkY7QUFBQTtBQUFBLHNCQTZCSUUsS0E3QkosRUE2Qlc7QUFDUCxXQUFLSixPQUFMLENBQWFLLEdBQWIsQ0FBaUIsR0FBakIsRUFBc0JELEtBQXRCOztBQUVBLGFBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7O0FBbkNGO0FBQUE7QUFBQSx5QkF5Q09BLEtBekNQLEVBeUNjO0FBQ1YsV0FBS0osT0FBTCxDQUFhSyxHQUFiLENBQWlCLE1BQWpCLEVBQXlCRCxLQUF6Qjs7QUFFQSxhQUFPLElBQVA7QUFDRDs7QUFFRDs7Ozs7OztBQS9DRjtBQUFBO0FBQUEsK0JBcURhQSxLQXJEYixFQXFEb0I7QUFDaEIsV0FBS0osT0FBTCxDQUFhSyxHQUFiLENBQWlCLFlBQWpCLEVBQStCRCxLQUEvQjs7QUFFQSxhQUFPLElBQVA7QUFDRDs7QUFFRDs7Ozs7OztBQTNERjtBQUFBO0FBQUEsNkJBaUVXQSxLQWpFWCxFQWlFa0I7QUFDZCxXQUFLSixPQUFMLENBQWFLLEdBQWIsQ0FBaUIsVUFBakIsRUFBNkJELEtBQTdCOztBQUVBLGFBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7O0FBdkVGO0FBQUE7QUFBQSx5QkE2RU9BLEtBN0VQLEVBNkVjO0FBQ1YsV0FBS0osT0FBTCxDQUFhSyxHQUFiLENBQWlCLE1BQWpCLEVBQXlCRCxLQUF6Qjs7QUFFQSxhQUFPLElBQVA7QUFDRDs7QUFFRDs7Ozs7OztBQW5GRjtBQUFBO0FBQUEsMkJBeUZTRSxNQXpGVCxFQXlGaUI7QUFDYixVQUFHQSxXQUFXQyxTQUFYLElBQXdCRCxXQUFXLElBQXRDLEVBQTRDO0FBQzFDLGFBQUtFLENBQUwsQ0FBT1gsYUFBYSxLQUFLRyxPQUFMLENBQWFFLFdBQWIsQ0FBeUJNLENBQXRDLENBQVA7QUFDRDs7QUFFRCxhQUFPLElBQVA7QUFDRDs7QUFFRDs7Ozs7OztBQWpHRjtBQUFBO0FBQUEsMkJBdUdTQyxZQXZHVCxFQXVHdUI7QUFDbkIsV0FBS1QsT0FBTCxDQUFhQyxNQUFiLENBQW9CUSxZQUFwQjs7QUFFQSxhQUFPLElBQVA7QUFDRDs7QUFFRDs7Ozs7O0FBN0dGO0FBQUE7QUFBQSw0QkFrSFU7QUFDTixhQUFPLEtBQUtULE9BQUwsQ0FBYVUsS0FBYixFQUFQO0FBQ0Q7QUFwSEg7O0FBQUE7QUFBQSIsImZpbGUiOiJzZWFyY2guanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2R5bGFuZm9uZy9Eb2N1bWVudHMvd29ya3NwYWNlL3dvcmsvcGMvY3BhdGgyLWNsaWVudCIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIFBjUmVxdWVzdCA9IHJlcXVpcmUoJy4vcHJpdmF0ZS9wYy1yZXF1ZXN0LmpzJyk7XG52YXIgZXNjYXBlTHVjZW5lID0gcmVxdWlyZSgnLi9wcml2YXRlL2hlbHBlcnMuanMnKS5lc2NhcGVMdWNlbmU7XG5cbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIFBlZm9ybXMgYSBzZWFyY2ggd2ViIHF1ZXJ5IHRvIHRoZSBQYXRod2F5IENvbW1vbnMgd2ViIHNlcnZpY2VcbiAqIEBhbGlhcyBzZWFyY2hcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBTZWFyY2gge1xuICAvKipcbiAgICogSW5pdGlhbGlzZXMgc2VhcmNoLiBDaGFpbmFibGUuXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge29iamVjdH0gW3F1ZXJ5T2JqZWN0XSAtIE9iamVjdCByZXByZXNlbnRpbmcgdGhlIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gYmUgc2VudCBhbG9uZyB3aXRoIHRoZSBzZWFyY2ggY29tbWFuZC5cbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlcXVlc3QgPSBuZXcgUGNSZXF1ZXN0KFwic2VhcmNoXCIpLmZvcm1hdChcImpzb25cIik7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhbGwgcXVlcnkgcGFyYW1ldGVycyB3aGljaCBhcmUgc2VudCB3aXRoIHRoZSBzZWFyY2ggcmVxdWVzdC4gV2lsbCBvdmVyd3JpdGUgZXhpc3RpbmcgcXVlcnkgc2V0dGluZ3MuXG4gICAqIEBtZXRob2Qgc2VhcmNoI3F1ZXJ5XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBxdWVyeU9iamVjdCAtIE9iamVjdCByZXByZXNlbnRpbmcgdGhlIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gYmUgc2VudCBhbG9uZyB3aXRoIHRoZSBzZWFyY2ggY29tbWFuZC5cbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBxdWVyeShxdWVyeU9iamVjdCkge1xuICAgIHRoaXMucmVxdWVzdC5xdWVyeShxdWVyeU9iamVjdCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHEgcGFyYW1ldGVyIHdoaWNoIGlzIHRvIGJlIHNlbnQgd2l0aCB0aGUgc2VhcmNoIHJlcXVlc3RcbiAgICogQG1ldGhvZCBzZWFyY2gjcVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSB1cmlcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBxKHZhbHVlKSB7XG4gICAgdGhpcy5yZXF1ZXN0LnNldChcInFcIiwgdmFsdWUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBwYWdlIHBhcmFtZXRlciB3aGljaCBpcyB0byBiZSBzZW50IHdpdGggdGhlIHNlYXJjaCByZXF1ZXN0XG4gICAqIEBtZXRob2Qgc2VhcmNoI3BhZ2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gcGFnZVxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIHBhZ2UodmFsdWUpIHtcbiAgICB0aGlzLnJlcXVlc3Quc2V0KFwicGFnZVwiLCB2YWx1ZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGRhdGFzb3VyY2UgcGFyYW1ldGVyIHdoaWNoIGlzIHRvIGJlIHNlbnQgd2l0aCB0aGUgc2VhcmNoIHJlcXVlc3RcbiAgICogQG1ldGhvZCBzZWFyY2gjZGF0YXNvdXJjZVxuICAgKiBAcGFyYW0ge3N0cmluZ3xhcnJheX0gdmFsdWUgLSBkYXRhc291cmNlXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgZGF0YXNvdXJjZSh2YWx1ZSkge1xuICAgIHRoaXMucmVxdWVzdC5zZXQoXCJkYXRhc291cmNlXCIsIHZhbHVlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgb3JnYW5pc20gcGFyYW1ldGVyIHdoaWNoIGlzIHRvIGJlIHNlbnQgd2l0aCB0aGUgc2VhcmNoIHJlcXVlc3RcbiAgICogQG1ldGhvZCBzZWFyY2gjb3JnYW5pc21cbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gb3JnYW5pc21cbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBvcmdhbmlzbSh2YWx1ZSkge1xuICAgIHRoaXMucmVxdWVzdC5zZXQoXCJvcmdhbmlzbVwiLCB2YWx1ZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHR5cGUgcGFyYW1ldGVyIHdoaWNoIGlzIHRvIGJlIHNlbnQgd2l0aCB0aGUgc2VhcmNoIHJlcXVlc3RcbiAgICogQG1ldGhvZCBzZWFyY2gjdHlwZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSB0eXBlXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgdHlwZSh2YWx1ZSkge1xuICAgIHRoaXMucmVxdWVzdC5zZXQoXCJ0eXBlXCIsIHZhbHVlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEVzY2FwZXMgd2hhdGV2ZXIgdmFsdWUgaXMgY29udGFpbmVkIGluIHEgYXQgdGhlIG1vbWVudFxuICAgKiBAbWV0aG9kIHNlYXJjaCNlc2NhcGVcbiAgICogQHBhcmFtIHtib29sZWFufSBbdG9nZ2xlPXRydWVdIC0gU3dpdGNoZXMgbHVjZW5lIGVzY2FwaW5nIG9uIG9yIG9mZi5cbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBlc2NhcGUodG9nZ2xlKSB7XG4gICAgaWYodG9nZ2xlID09PSB1bmRlZmluZWQgfHwgdG9nZ2xlID09PSB0cnVlKSB7XG4gICAgICB0aGlzLnEoZXNjYXBlTHVjZW5lKHRoaXMucmVxdWVzdC5xdWVyeU9iamVjdC5xKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBmb3JtYXQgb2YgcmV0dXJuZWQgZGF0YVxuICAgKiBAbWV0aG9kIHNlYXJjaCNmb3JtYXRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZvcm1hdFN0cmluZ1xuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIGZvcm1hdChmb3JtYXRTdHJpbmcpIHtcbiAgICB0aGlzLnJlcXVlc3QuZm9ybWF0KGZvcm1hdFN0cmluZyk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlcyBhIGZldGNoIGNhbGwgdG8gdGhlIFBDIEFQSSBhbmQgcmV0dXJuIHJlc3VsdHNcbiAgICogQG1ldGhvZCBzZWFyY2gjZmV0Y2hcbiAgICogQHJldHVybiB7UHJvbWlzZTxzdHJpbmc+fFByb21pc2U8b2JqZWN0Pn0gLSBQcm9taXNlIHJldHVybmluZyBlaXRoZXIgYW4gb2JqZWN0IG9yIHN0cmluZyBkZXBlbmRpbmcgb24gZm9ybWF0XG4gICAqL1xuICBmZXRjaCgpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0LmZldGNoKCk7XG4gIH1cbn1cbiJdfQ==

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PcRequest = __webpack_require__(0);

/**
 * @class
 * @classdesc Peforms a traverse query to the Pathway Commons web service
 * @alias traverse
 */
module.exports = function () {
  /**
   * Initialises traverse. Chainable.
   * @constructor
   * @returns {this}
   */
  function Traverse() {
    _classCallCheck(this, Traverse);

    this.request = new PcRequest("traverse").format("json");
  }

  /**
   * Sets all query parameters which are sent with the traverse request. Will overwrite existing query settings.
   * @method traverse#query
   * @param {object} queryObject - Object representing the query parameters to be sent along with the traverse command.
   * @returns {this}
   */


  _createClass(Traverse, [{
    key: 'query',
    value: function query(queryObject) {
      this.request.query(queryObject);

      return this;
    }

    /**
     * Sets uri parameter which is to be sent with the traverse request
     * @method traverse#uri
     * @param {string} value - uri
     * @returns {this}
     */

  }, {
    key: 'uri',
    value: function uri(value) {
      this.request.set("uri", value);

      return this;
    }

    /**
     * Sets path parameter which is to be sent with the traverse request
     * @method traverse#path
     * @param {string} value - uri
     * @returns {this}
     */

  }, {
    key: 'path',
    value: function path(value) {
      this.request.set("path", value);

      return this;
    }

    /**
     * Sets format of returned data
     * @method traverse#format
     * @param {string} formatString
     * @returns {this}
     */

  }, {
    key: 'format',
    value: function format(formatString) {
      this.request.format(formatString);

      return this;
    }

    /**
     * Makes a fetch call to the PC API and return results
     * @method traverse#fetch
     * @return {Promise<string>|Promise<object>} - Promise returning either an object or string depending on format
     */

  }, {
    key: 'fetch',
    value: function fetch() {
      return this.request.fetch();
    }
  }]);

  return Traverse;
}();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy90cmF2ZXJzZS5qcyJdLCJuYW1lcyI6WyJQY1JlcXVlc3QiLCJyZXF1aXJlIiwibW9kdWxlIiwiZXhwb3J0cyIsInJlcXVlc3QiLCJmb3JtYXQiLCJxdWVyeU9iamVjdCIsInF1ZXJ5IiwidmFsdWUiLCJzZXQiLCJmb3JtYXRTdHJpbmciLCJmZXRjaCJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQUVBLElBQUlBLFlBQVlDLFFBQVEseUJBQVIsQ0FBaEI7O0FBRUE7Ozs7O0FBS0FDLE9BQU9DLE9BQVA7QUFDRTs7Ozs7QUFLQSxzQkFBYztBQUFBOztBQUNaLFNBQUtDLE9BQUwsR0FBZSxJQUFJSixTQUFKLENBQWMsVUFBZCxFQUEwQkssTUFBMUIsQ0FBaUMsTUFBakMsQ0FBZjtBQUNEOztBQUVEOzs7Ozs7OztBQVZGO0FBQUE7QUFBQSwwQkFnQlFDLFdBaEJSLEVBZ0JxQjtBQUNqQixXQUFLRixPQUFMLENBQWFHLEtBQWIsQ0FBbUJELFdBQW5COztBQUVBLGFBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7O0FBdEJGO0FBQUE7QUFBQSx3QkE0Qk1FLEtBNUJOLEVBNEJhO0FBQ1QsV0FBS0osT0FBTCxDQUFhSyxHQUFiLENBQWlCLEtBQWpCLEVBQXdCRCxLQUF4Qjs7QUFFQSxhQUFPLElBQVA7QUFDRDs7QUFFRDs7Ozs7OztBQWxDRjtBQUFBO0FBQUEseUJBd0NPQSxLQXhDUCxFQXdDYztBQUNWLFdBQUtKLE9BQUwsQ0FBYUssR0FBYixDQUFpQixNQUFqQixFQUF5QkQsS0FBekI7O0FBRUEsYUFBTyxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUE5Q0Y7QUFBQTtBQUFBLDJCQW9EU0UsWUFwRFQsRUFvRHVCO0FBQ25CLFdBQUtOLE9BQUwsQ0FBYUMsTUFBYixDQUFvQkssWUFBcEI7O0FBRUEsYUFBTyxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7OztBQTFERjtBQUFBO0FBQUEsNEJBK0RVO0FBQ04sYUFBTyxLQUFLTixPQUFMLENBQWFPLEtBQWIsRUFBUDtBQUNEO0FBakVIOztBQUFBO0FBQUEiLCJmaWxlIjoidHJhdmVyc2UuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2R5bGFuZm9uZy9Eb2N1bWVudHMvd29ya3NwYWNlL3dvcmsvcGMvY3BhdGgyLWNsaWVudCIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIFBjUmVxdWVzdCA9IHJlcXVpcmUoJy4vcHJpdmF0ZS9wYy1yZXF1ZXN0LmpzJyk7XG5cbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIFBlZm9ybXMgYSB0cmF2ZXJzZSBxdWVyeSB0byB0aGUgUGF0aHdheSBDb21tb25zIHdlYiBzZXJ2aWNlXG4gKiBAYWxpYXMgdHJhdmVyc2VcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBUcmF2ZXJzZSB7XG4gIC8qKlxuICAgKiBJbml0aWFsaXNlcyB0cmF2ZXJzZS4gQ2hhaW5hYmxlLlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlcXVlc3QgPSBuZXcgUGNSZXF1ZXN0KFwidHJhdmVyc2VcIikuZm9ybWF0KFwianNvblwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGFsbCBxdWVyeSBwYXJhbWV0ZXJzIHdoaWNoIGFyZSBzZW50IHdpdGggdGhlIHRyYXZlcnNlIHJlcXVlc3QuIFdpbGwgb3ZlcndyaXRlIGV4aXN0aW5nIHF1ZXJ5IHNldHRpbmdzLlxuICAgKiBAbWV0aG9kIHRyYXZlcnNlI3F1ZXJ5XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBxdWVyeU9iamVjdCAtIE9iamVjdCByZXByZXNlbnRpbmcgdGhlIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gYmUgc2VudCBhbG9uZyB3aXRoIHRoZSB0cmF2ZXJzZSBjb21tYW5kLlxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIHF1ZXJ5KHF1ZXJ5T2JqZWN0KSB7XG4gICAgdGhpcy5yZXF1ZXN0LnF1ZXJ5KHF1ZXJ5T2JqZWN0KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdXJpIHBhcmFtZXRlciB3aGljaCBpcyB0byBiZSBzZW50IHdpdGggdGhlIHRyYXZlcnNlIHJlcXVlc3RcbiAgICogQG1ldGhvZCB0cmF2ZXJzZSN1cmlcbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gdXJpXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgdXJpKHZhbHVlKSB7XG4gICAgdGhpcy5yZXF1ZXN0LnNldChcInVyaVwiLCB2YWx1ZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHBhdGggcGFyYW1ldGVyIHdoaWNoIGlzIHRvIGJlIHNlbnQgd2l0aCB0aGUgdHJhdmVyc2UgcmVxdWVzdFxuICAgKiBAbWV0aG9kIHRyYXZlcnNlI3BhdGhcbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gdXJpXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgcGF0aCh2YWx1ZSkge1xuICAgIHRoaXMucmVxdWVzdC5zZXQoXCJwYXRoXCIsIHZhbHVlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgZm9ybWF0IG9mIHJldHVybmVkIGRhdGFcbiAgICogQG1ldGhvZCB0cmF2ZXJzZSNmb3JtYXRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZvcm1hdFN0cmluZ1xuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIGZvcm1hdChmb3JtYXRTdHJpbmcpIHtcbiAgICB0aGlzLnJlcXVlc3QuZm9ybWF0KGZvcm1hdFN0cmluZyk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlcyBhIGZldGNoIGNhbGwgdG8gdGhlIFBDIEFQSSBhbmQgcmV0dXJuIHJlc3VsdHNcbiAgICogQG1ldGhvZCB0cmF2ZXJzZSNmZXRjaFxuICAgKiBAcmV0dXJuIHtQcm9taXNlPHN0cmluZz58UHJvbWlzZTxvYmplY3Q+fSAtIFByb21pc2UgcmV0dXJuaW5nIGVpdGhlciBhbiBvYmplY3Qgb3Igc3RyaW5nIGRlcGVuZGluZyBvbiBmb3JtYXRcbiAgICovXG4gIGZldGNoKCkge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QuZmV0Y2goKTtcbiAgfVxufVxuIl19

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PcRequest = __webpack_require__(0);
var sourceCheck = __webpack_require__(2).sourceCheck;

/**
 * @class
 * @classdesc Peforms a graph web query to the Pathway Commons web service
 * @alias graph
 */
module.exports = function () {
  /**
   * Initialises graph. Chainable.
   * @constructor
   * @returns {this}
   */
  function Graph() {
    _classCallCheck(this, Graph);

    this.request = new PcRequest("graph");
  }

  /**
   * Sets all query parameters which are sent with the graph request. Will overwrite existing query settings.
   * @method graph#query
   * @param {object} queryObject - Object representing the query parameters to be sent along with the graph command.
   * @returns {this}
   */


  _createClass(Graph, [{
    key: 'query',
    value: function query(queryObject) {
      this.request.query(queryObject);

      return this;
    }

    /**
     * Sets kind parameter which is to be sent with the graph request
     * @method graph#kind
     * @param {string} value - kind
     * @returns {this}
     */

  }, {
    key: 'kind',
    value: function kind(value) {
      this.request.set("kind", value);

      return this;
    }

    /**
     * Sets source parameter which is to be sent with the graph request
     * @method graph#source
     * @param {string|array} value - source
     * @returns {this}
     */

  }, {
    key: 'source',
    value: function source(value, datasource) {
      if (datasource === undefined || sourceCheck(datasource, value)) {
        this.request.set("source", value);
      } else {
        throw new SyntaxError(value + " is an invalid " + datasource.toUpperCase() + " ID");
      }

      return this;
    }

    /**
     * Sets target parameter which is to be sent with the graph request
     * @method graph#target
     * @param {string|array} value - target
     * @returns {this}
     */

  }, {
    key: 'target',
    value: function target(value, datasource) {
      if (datasource !== undefined) {
        this.request.set("target", value);
      } else {
        sourceCheck(datasource, value) ? this.request.set("target", value) : function () {
          throw new SyntaxError(value + " invalid " + datasource);
        };
      }

      return this;
    }

    /**
     * Sets direction parameter which is to be sent with the graph request
     * @method graph#direction
     * @param {string} value - direction
     * @returns {this}
     */

  }, {
    key: 'direction',
    value: function direction(value) {
      this.request.set("direction", value);

      return this;
    }

    /**
     * Sets limit parameter which is to be sent with the graph request
     * @method graph#limit
     * @param {number} value - limit
     * @returns {this}
     */

  }, {
    key: 'limit',
    value: function limit(value) {
      this.request.set("limit", value);

      return this;
    }

    /**
     * Sets format parameter which is to be sent with the graph request
     * @method graph#format
     * @param {string} value - format
     * @returns {this}
     */

  }, {
    key: 'format',
    value: function format(value) {
      this.request.set("format", value);

      return this;
    }

    /**
     * Sets datasource parameter which is to be sent with the graph request
     * @method graph#datasource
     * @param {string|array} value - datasource
     * @returns {this}
     */

  }, {
    key: 'datasource',
    value: function datasource(value) {
      this.request.set("datasource", value);

      return this;
    }

    /**
     * Sets organism parameter which is to be sent with the graph request
     * @method graph#organism
     * @param {string} value - organism
     * @returns {this}
     */

  }, {
    key: 'organism',
    value: function organism(value) {
      this.request.set("organism", value);

      return this;
    }

    /**
     * Makes a fetch call to the PC API and return results
     * @method graph#fetch
     * @return {Promise<string>|Promise<object>} - Promise returning either an object or string depending on response headers
     */

  }, {
    key: 'fetch',
    value: function fetch() {
      return this.request.fetch();
    }
  }]);

  return Graph;
}();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9ncmFwaC5qcyJdLCJuYW1lcyI6WyJQY1JlcXVlc3QiLCJyZXF1aXJlIiwic291cmNlQ2hlY2siLCJtb2R1bGUiLCJleHBvcnRzIiwicmVxdWVzdCIsInF1ZXJ5T2JqZWN0IiwicXVlcnkiLCJ2YWx1ZSIsInNldCIsImRhdGFzb3VyY2UiLCJ1bmRlZmluZWQiLCJTeW50YXhFcnJvciIsInRvVXBwZXJDYXNlIiwiZmV0Y2giXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUFFQSxJQUFJQSxZQUFZQyxRQUFRLHlCQUFSLENBQWhCO0FBQ0EsSUFBSUMsY0FBY0QsUUFBUSxnQkFBUixFQUEwQkMsV0FBNUM7O0FBRUE7Ozs7O0FBS0FDLE9BQU9DLE9BQVA7QUFDRTs7Ozs7QUFLQSxtQkFBYztBQUFBOztBQUNaLFNBQUtDLE9BQUwsR0FBZSxJQUFJTCxTQUFKLENBQWMsT0FBZCxDQUFmO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O0FBVkY7QUFBQTtBQUFBLDBCQWdCUU0sV0FoQlIsRUFnQnFCO0FBQ2pCLFdBQUtELE9BQUwsQ0FBYUUsS0FBYixDQUFtQkQsV0FBbkI7O0FBRUEsYUFBTyxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUF0QkY7QUFBQTtBQUFBLHlCQTRCT0UsS0E1QlAsRUE0QmM7QUFDVixXQUFLSCxPQUFMLENBQWFJLEdBQWIsQ0FBaUIsTUFBakIsRUFBeUJELEtBQXpCOztBQUVBLGFBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7O0FBbENGO0FBQUE7QUFBQSwyQkF3Q1NBLEtBeENULEVBd0NnQkUsVUF4Q2hCLEVBd0M0QjtBQUN4QixVQUFJQSxlQUFlQyxTQUFmLElBQTRCVCxZQUFZUSxVQUFaLEVBQXdCRixLQUF4QixDQUFoQyxFQUFnRTtBQUM5RCxhQUFLSCxPQUFMLENBQWFJLEdBQWIsQ0FBaUIsUUFBakIsRUFBMkJELEtBQTNCO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsY0FBTSxJQUFJSSxXQUFKLENBQWdCSixRQUFRLGlCQUFSLEdBQTRCRSxXQUFXRyxXQUFYLEVBQTVCLEdBQXVELEtBQXZFLENBQU47QUFDRDs7QUFFRCxhQUFPLElBQVA7QUFDRDs7QUFFRDs7Ozs7OztBQWxERjtBQUFBO0FBQUEsMkJBd0RTTCxLQXhEVCxFQXdEZ0JFLFVBeERoQixFQXdENEI7QUFDeEIsVUFBSUEsZUFBZUMsU0FBbkIsRUFBOEI7QUFDNUIsYUFBS04sT0FBTCxDQUFhSSxHQUFiLENBQWlCLFFBQWpCLEVBQTJCRCxLQUEzQjtBQUNELE9BRkQsTUFFTztBQUNMTixvQkFBWVEsVUFBWixFQUF3QkYsS0FBeEIsSUFBaUMsS0FBS0gsT0FBTCxDQUFhSSxHQUFiLENBQWlCLFFBQWpCLEVBQTJCRCxLQUEzQixDQUFqQyxHQUFxRSxZQUFNO0FBQ3pFLGdCQUFNLElBQUlJLFdBQUosQ0FBZ0JKLFFBQVEsV0FBUixHQUFzQkUsVUFBdEMsQ0FBTjtBQUNELFNBRkQ7QUFHRDs7QUFFRCxhQUFPLElBQVA7QUFDRDs7QUFFRDs7Ozs7OztBQXBFRjtBQUFBO0FBQUEsOEJBMEVZRixLQTFFWixFQTBFbUI7QUFDZixXQUFLSCxPQUFMLENBQWFJLEdBQWIsQ0FBaUIsV0FBakIsRUFBOEJELEtBQTlCOztBQUVBLGFBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7O0FBaEZGO0FBQUE7QUFBQSwwQkFzRlFBLEtBdEZSLEVBc0ZlO0FBQ1gsV0FBS0gsT0FBTCxDQUFhSSxHQUFiLENBQWlCLE9BQWpCLEVBQTBCRCxLQUExQjs7QUFFQSxhQUFPLElBQVA7QUFDRDs7QUFFRDs7Ozs7OztBQTVGRjtBQUFBO0FBQUEsMkJBa0dTQSxLQWxHVCxFQWtHZ0I7QUFDWixXQUFLSCxPQUFMLENBQWFJLEdBQWIsQ0FBaUIsUUFBakIsRUFBMkJELEtBQTNCOztBQUVBLGFBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7O0FBeEdGO0FBQUE7QUFBQSwrQkE4R2FBLEtBOUdiLEVBOEdvQjtBQUNoQixXQUFLSCxPQUFMLENBQWFJLEdBQWIsQ0FBaUIsWUFBakIsRUFBK0JELEtBQS9COztBQUVBLGFBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7O0FBcEhGO0FBQUE7QUFBQSw2QkEwSFdBLEtBMUhYLEVBMEhrQjtBQUNkLFdBQUtILE9BQUwsQ0FBYUksR0FBYixDQUFpQixVQUFqQixFQUE2QkQsS0FBN0I7O0FBRUEsYUFBTyxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7OztBQWhJRjtBQUFBO0FBQUEsNEJBcUlVO0FBQ04sYUFBTyxLQUFLSCxPQUFMLENBQWFTLEtBQWIsRUFBUDtBQUNEO0FBdklIOztBQUFBO0FBQUEiLCJmaWxlIjoiZ3JhcGguanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2R5bGFuZm9uZy9Eb2N1bWVudHMvd29ya3NwYWNlL3dvcmsvcGMvY3BhdGgyLWNsaWVudCIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIFBjUmVxdWVzdCA9IHJlcXVpcmUoJy4vcHJpdmF0ZS9wYy1yZXF1ZXN0LmpzJyk7XG52YXIgc291cmNlQ2hlY2sgPSByZXF1aXJlKCcuL3V0aWxpdGllcy5qcycpLnNvdXJjZUNoZWNrO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBQZWZvcm1zIGEgZ3JhcGggd2ViIHF1ZXJ5IHRvIHRoZSBQYXRod2F5IENvbW1vbnMgd2ViIHNlcnZpY2VcbiAqIEBhbGlhcyBncmFwaFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEdyYXBoIHtcbiAgLyoqXG4gICAqIEluaXRpYWxpc2VzIGdyYXBoLiBDaGFpbmFibGUuXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVxdWVzdCA9IG5ldyBQY1JlcXVlc3QoXCJncmFwaFwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGFsbCBxdWVyeSBwYXJhbWV0ZXJzIHdoaWNoIGFyZSBzZW50IHdpdGggdGhlIGdyYXBoIHJlcXVlc3QuIFdpbGwgb3ZlcndyaXRlIGV4aXN0aW5nIHF1ZXJ5IHNldHRpbmdzLlxuICAgKiBAbWV0aG9kIGdyYXBoI3F1ZXJ5XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBxdWVyeU9iamVjdCAtIE9iamVjdCByZXByZXNlbnRpbmcgdGhlIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gYmUgc2VudCBhbG9uZyB3aXRoIHRoZSBncmFwaCBjb21tYW5kLlxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIHF1ZXJ5KHF1ZXJ5T2JqZWN0KSB7XG4gICAgdGhpcy5yZXF1ZXN0LnF1ZXJ5KHF1ZXJ5T2JqZWN0KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMga2luZCBwYXJhbWV0ZXIgd2hpY2ggaXMgdG8gYmUgc2VudCB3aXRoIHRoZSBncmFwaCByZXF1ZXN0XG4gICAqIEBtZXRob2QgZ3JhcGgja2luZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSBraW5kXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAga2luZCh2YWx1ZSkge1xuICAgIHRoaXMucmVxdWVzdC5zZXQoXCJraW5kXCIsIHZhbHVlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgc291cmNlIHBhcmFtZXRlciB3aGljaCBpcyB0byBiZSBzZW50IHdpdGggdGhlIGdyYXBoIHJlcXVlc3RcbiAgICogQG1ldGhvZCBncmFwaCNzb3VyY2VcbiAgICogQHBhcmFtIHtzdHJpbmd8YXJyYXl9IHZhbHVlIC0gc291cmNlXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgc291cmNlKHZhbHVlLCBkYXRhc291cmNlKSB7XG4gICAgaWYgKGRhdGFzb3VyY2UgPT09IHVuZGVmaW5lZCB8fCBzb3VyY2VDaGVjayhkYXRhc291cmNlLCB2YWx1ZSkpIHtcbiAgICAgIHRoaXMucmVxdWVzdC5zZXQoXCJzb3VyY2VcIiwgdmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IodmFsdWUgKyBcIiBpcyBhbiBpbnZhbGlkIFwiICsgZGF0YXNvdXJjZS50b1VwcGVyQ2FzZSgpICsgXCIgSURcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0YXJnZXQgcGFyYW1ldGVyIHdoaWNoIGlzIHRvIGJlIHNlbnQgd2l0aCB0aGUgZ3JhcGggcmVxdWVzdFxuICAgKiBAbWV0aG9kIGdyYXBoI3RhcmdldFxuICAgKiBAcGFyYW0ge3N0cmluZ3xhcnJheX0gdmFsdWUgLSB0YXJnZXRcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICB0YXJnZXQodmFsdWUsIGRhdGFzb3VyY2UpIHtcbiAgICBpZiAoZGF0YXNvdXJjZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnJlcXVlc3Quc2V0KFwidGFyZ2V0XCIsIHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc291cmNlQ2hlY2soZGF0YXNvdXJjZSwgdmFsdWUpID8gdGhpcy5yZXF1ZXN0LnNldChcInRhcmdldFwiLCB2YWx1ZSkgOiAoKSA9PiB7XG4gICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcih2YWx1ZSArIFwiIGludmFsaWQgXCIgKyBkYXRhc291cmNlKVxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGRpcmVjdGlvbiBwYXJhbWV0ZXIgd2hpY2ggaXMgdG8gYmUgc2VudCB3aXRoIHRoZSBncmFwaCByZXF1ZXN0XG4gICAqIEBtZXRob2QgZ3JhcGgjZGlyZWN0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIGRpcmVjdGlvblxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIGRpcmVjdGlvbih2YWx1ZSkge1xuICAgIHRoaXMucmVxdWVzdC5zZXQoXCJkaXJlY3Rpb25cIiwgdmFsdWUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBsaW1pdCBwYXJhbWV0ZXIgd2hpY2ggaXMgdG8gYmUgc2VudCB3aXRoIHRoZSBncmFwaCByZXF1ZXN0XG4gICAqIEBtZXRob2QgZ3JhcGgjbGltaXRcbiAgICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIC0gbGltaXRcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBsaW1pdCh2YWx1ZSkge1xuICAgIHRoaXMucmVxdWVzdC5zZXQoXCJsaW1pdFwiLCB2YWx1ZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGZvcm1hdCBwYXJhbWV0ZXIgd2hpY2ggaXMgdG8gYmUgc2VudCB3aXRoIHRoZSBncmFwaCByZXF1ZXN0XG4gICAqIEBtZXRob2QgZ3JhcGgjZm9ybWF0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIGZvcm1hdFxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIGZvcm1hdCh2YWx1ZSkge1xuICAgIHRoaXMucmVxdWVzdC5zZXQoXCJmb3JtYXRcIiwgdmFsdWUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBkYXRhc291cmNlIHBhcmFtZXRlciB3aGljaCBpcyB0byBiZSBzZW50IHdpdGggdGhlIGdyYXBoIHJlcXVlc3RcbiAgICogQG1ldGhvZCBncmFwaCNkYXRhc291cmNlXG4gICAqIEBwYXJhbSB7c3RyaW5nfGFycmF5fSB2YWx1ZSAtIGRhdGFzb3VyY2VcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBkYXRhc291cmNlKHZhbHVlKSB7XG4gICAgdGhpcy5yZXF1ZXN0LnNldChcImRhdGFzb3VyY2VcIiwgdmFsdWUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBvcmdhbmlzbSBwYXJhbWV0ZXIgd2hpY2ggaXMgdG8gYmUgc2VudCB3aXRoIHRoZSBncmFwaCByZXF1ZXN0XG4gICAqIEBtZXRob2QgZ3JhcGgjb3JnYW5pc21cbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gb3JnYW5pc21cbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBvcmdhbmlzbSh2YWx1ZSkge1xuICAgIHRoaXMucmVxdWVzdC5zZXQoXCJvcmdhbmlzbVwiLCB2YWx1ZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlcyBhIGZldGNoIGNhbGwgdG8gdGhlIFBDIEFQSSBhbmQgcmV0dXJuIHJlc3VsdHNcbiAgICogQG1ldGhvZCBncmFwaCNmZXRjaFxuICAgKiBAcmV0dXJuIHtQcm9taXNlPHN0cmluZz58UHJvbWlzZTxvYmplY3Q+fSAtIFByb21pc2UgcmV0dXJuaW5nIGVpdGhlciBhbiBvYmplY3Qgb3Igc3RyaW5nIGRlcGVuZGluZyBvbiByZXNwb25zZSBoZWFkZXJzXG4gICAqL1xuICBmZXRjaCgpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0LmZldGNoKCk7XG4gIH1cbn1cbiJdfQ==

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PcRequest = __webpack_require__(0);

/**
 * @class
 * @classdesc Peforms a get web query to the Pathway Commons web service
 * @alias top_pathways
 */
module.exports = function () {
  /**
   * Initialises top_pathways. Chainable.
   * @constructor
   * @returns {this}
   */
  function Top_Pathways() {
    _classCallCheck(this, Top_Pathways);

    this.request = new PcRequest("top_pathways").format("json");
  }

  /**
   * Sets all query parameters which are sent with the request. Will overwrite existing query settings.
   * @method top_pathways#query
   * @param {object} queryObject - Object representing the query parameters to be sent along with the get command.
   * @returns {this}
   */


  _createClass(Top_Pathways, [{
    key: 'query',
    value: function query(queryObject) {
      this.request.query(queryObject);

      return this;
    }

    /**
     * Sets q parameter which is to be sent with the top_pathways request
     * @method top_pathways#q
     * @param {string} value - q
     * @returns {this}
     */

  }, {
    key: 'q',
    value: function q(value) {
      this.request.set("q", value);

      return this;
    }

    /**
     * Sets datasource parameter which is to be sent with the top_pathways request
     * @method top_pathways#datasource
     * @param {string|array} value - datasource
     * @returns {this}
     */

  }, {
    key: 'datasource',
    value: function datasource(value) {
      this.request.set("datasource", value);

      return this;
    }

    /**
     * Sets organism parameter which is to be sent with the top_pathways request
     * @method top_pathways#organism
     * @param {string} value - organism
     * @returns {this}
     */

  }, {
    key: 'organism',
    value: function organism(value) {
      this.request.set("organism", value);

      return this;
    }

    /**
     * Sets format of returned data
     * @method top_pathways#format
     * @param {string} value - format
     * @returns {this}
     */

  }, {
    key: 'format',
    value: function format(value) {
      this.request.format(value);

      return this;
    }

    /**
     * Makes a fetch call to the PC API and return results
     * @method top_pathways#fetch
     * @return {Promise<string>|Promise<object>} - Promise returning either an object or string depending on format
     */

  }, {
    key: 'fetch',
    value: function fetch() {
      return this.request.fetch();
    }
  }]);

  return Top_Pathways;
}();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy90b3BfcGF0aHdheXMuanMiXSwibmFtZXMiOlsiUGNSZXF1ZXN0IiwicmVxdWlyZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJyZXF1ZXN0IiwiZm9ybWF0IiwicXVlcnlPYmplY3QiLCJxdWVyeSIsInZhbHVlIiwic2V0IiwiZmV0Y2giXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUFFQSxJQUFJQSxZQUFZQyxRQUFRLHlCQUFSLENBQWhCOztBQUVBOzs7OztBQUtBQyxPQUFPQyxPQUFQO0FBQ0U7Ozs7O0FBS0EsMEJBQWM7QUFBQTs7QUFDWixTQUFLQyxPQUFMLEdBQWUsSUFBSUosU0FBSixDQUFjLGNBQWQsRUFBOEJLLE1BQTlCLENBQXFDLE1BQXJDLENBQWY7QUFDRDs7QUFFRDs7Ozs7Ozs7QUFWRjtBQUFBO0FBQUEsMEJBZ0JRQyxXQWhCUixFQWdCcUI7QUFDakIsV0FBS0YsT0FBTCxDQUFhRyxLQUFiLENBQW1CRCxXQUFuQjs7QUFFQSxhQUFPLElBQVA7QUFDRDs7QUFFRDs7Ozs7OztBQXRCRjtBQUFBO0FBQUEsc0JBNEJJRSxLQTVCSixFQTRCVztBQUNQLFdBQUtKLE9BQUwsQ0FBYUssR0FBYixDQUFpQixHQUFqQixFQUFzQkQsS0FBdEI7O0FBRUEsYUFBTyxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUFsQ0Y7QUFBQTtBQUFBLCtCQXdDYUEsS0F4Q2IsRUF3Q29CO0FBQ2hCLFdBQUtKLE9BQUwsQ0FBYUssR0FBYixDQUFpQixZQUFqQixFQUErQkQsS0FBL0I7O0FBRUEsYUFBTyxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUE5Q0Y7QUFBQTtBQUFBLDZCQW9EV0EsS0FwRFgsRUFvRGtCO0FBQ2QsV0FBS0osT0FBTCxDQUFhSyxHQUFiLENBQWlCLFVBQWpCLEVBQTZCRCxLQUE3Qjs7QUFFQSxhQUFPLElBQVA7QUFDRDs7QUFFRDs7Ozs7OztBQTFERjtBQUFBO0FBQUEsMkJBZ0VTQSxLQWhFVCxFQWdFZ0I7QUFDWixXQUFLSixPQUFMLENBQWFDLE1BQWIsQ0FBb0JHLEtBQXBCOztBQUVBLGFBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7QUF0RUY7QUFBQTtBQUFBLDRCQTJFVTtBQUNOLGFBQU8sS0FBS0osT0FBTCxDQUFhTSxLQUFiLEVBQVA7QUFDRDtBQTdFSDs7QUFBQTtBQUFBIiwiZmlsZSI6InRvcF9wYXRod2F5cy5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZHlsYW5mb25nL0RvY3VtZW50cy93b3Jrc3BhY2Uvd29yay9wYy9jcGF0aDItY2xpZW50Iiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUGNSZXF1ZXN0ID0gcmVxdWlyZSgnLi9wcml2YXRlL3BjLXJlcXVlc3QuanMnKTtcblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgUGVmb3JtcyBhIGdldCB3ZWIgcXVlcnkgdG8gdGhlIFBhdGh3YXkgQ29tbW9ucyB3ZWIgc2VydmljZVxuICogQGFsaWFzIHRvcF9wYXRod2F5c1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFRvcF9QYXRod2F5cyB7XG4gIC8qKlxuICAgKiBJbml0aWFsaXNlcyB0b3BfcGF0aHdheXMuIENoYWluYWJsZS5cbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXF1ZXN0ID0gbmV3IFBjUmVxdWVzdChcInRvcF9wYXRod2F5c1wiKS5mb3JtYXQoXCJqc29uXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYWxsIHF1ZXJ5IHBhcmFtZXRlcnMgd2hpY2ggYXJlIHNlbnQgd2l0aCB0aGUgcmVxdWVzdC4gV2lsbCBvdmVyd3JpdGUgZXhpc3RpbmcgcXVlcnkgc2V0dGluZ3MuXG4gICAqIEBtZXRob2QgdG9wX3BhdGh3YXlzI3F1ZXJ5XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBxdWVyeU9iamVjdCAtIE9iamVjdCByZXByZXNlbnRpbmcgdGhlIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gYmUgc2VudCBhbG9uZyB3aXRoIHRoZSBnZXQgY29tbWFuZC5cbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBxdWVyeShxdWVyeU9iamVjdCkge1xuICAgIHRoaXMucmVxdWVzdC5xdWVyeShxdWVyeU9iamVjdCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHEgcGFyYW1ldGVyIHdoaWNoIGlzIHRvIGJlIHNlbnQgd2l0aCB0aGUgdG9wX3BhdGh3YXlzIHJlcXVlc3RcbiAgICogQG1ldGhvZCB0b3BfcGF0aHdheXMjcVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSBxXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgcSh2YWx1ZSkge1xuICAgIHRoaXMucmVxdWVzdC5zZXQoXCJxXCIsIHZhbHVlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgZGF0YXNvdXJjZSBwYXJhbWV0ZXIgd2hpY2ggaXMgdG8gYmUgc2VudCB3aXRoIHRoZSB0b3BfcGF0aHdheXMgcmVxdWVzdFxuICAgKiBAbWV0aG9kIHRvcF9wYXRod2F5cyNkYXRhc291cmNlXG4gICAqIEBwYXJhbSB7c3RyaW5nfGFycmF5fSB2YWx1ZSAtIGRhdGFzb3VyY2VcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBkYXRhc291cmNlKHZhbHVlKSB7XG4gICAgdGhpcy5yZXF1ZXN0LnNldChcImRhdGFzb3VyY2VcIiwgdmFsdWUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBvcmdhbmlzbSBwYXJhbWV0ZXIgd2hpY2ggaXMgdG8gYmUgc2VudCB3aXRoIHRoZSB0b3BfcGF0aHdheXMgcmVxdWVzdFxuICAgKiBAbWV0aG9kIHRvcF9wYXRod2F5cyNvcmdhbmlzbVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSBvcmdhbmlzbVxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIG9yZ2FuaXNtKHZhbHVlKSB7XG4gICAgdGhpcy5yZXF1ZXN0LnNldChcIm9yZ2FuaXNtXCIsIHZhbHVlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgZm9ybWF0IG9mIHJldHVybmVkIGRhdGFcbiAgICogQG1ldGhvZCB0b3BfcGF0aHdheXMjZm9ybWF0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIGZvcm1hdFxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIGZvcm1hdCh2YWx1ZSkge1xuICAgIHRoaXMucmVxdWVzdC5mb3JtYXQodmFsdWUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogTWFrZXMgYSBmZXRjaCBjYWxsIHRvIHRoZSBQQyBBUEkgYW5kIHJldHVybiByZXN1bHRzXG4gICAqIEBtZXRob2QgdG9wX3BhdGh3YXlzI2ZldGNoXG4gICAqIEByZXR1cm4ge1Byb21pc2U8c3RyaW5nPnxQcm9taXNlPG9iamVjdD59IC0gUHJvbWlzZSByZXR1cm5pbmcgZWl0aGVyIGFuIG9iamVjdCBvciBzdHJpbmcgZGVwZW5kaW5nIG9uIGZvcm1hdFxuICAgKi9cbiAgZmV0Y2goKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdC5mZXRjaCgpO1xuICB9XG59XG4iXX0=

/***/ })
/******/ ]);