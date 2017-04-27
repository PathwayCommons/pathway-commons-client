'use strict';

var fetch = require('fetch-ponyfill')().fetch;
var constants = require('./private/constants.js');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxpdGllcy5qcyJdLCJuYW1lcyI6WyJmZXRjaCIsInJlcXVpcmUiLCJjb25zdGFudHMiLCJfaWQiLCJtb2R1bGUiLCJleHBvcnRzIiwidXNlciIsIm5ld0lkIiwidW5kZWZpbmVkIiwiaWRQcmVmaXgiLCJwY0NoZWNrIiwidGltZW91dCIsImFkZHJlc3MiLCJwY0FkZHJlc3MiLCJ0aW1lb3V0VmFsdWUiLCJOdW1iZXIiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIlhNTEh0dHBSZXF1ZXN0IiwieGh0dHAiLCJ0aW1lb3V0UmVmIiwic2V0VGltZW91dCIsImFib3J0Iiwib3BlbiIsIm9ucmVhZHlzdGF0ZWNoYW5nZSIsInJlYWR5U3RhdGUiLCJET05FIiwic3RhdHVzIiwiY2xlYXJUaW1lb3V0Iiwic2VuZCIsIm1ldGhvZCIsInRoZW4iLCJyZXNwb25zZSIsImNhdGNoIiwic291cmNlQ2hlY2siLCJzb3VyY2VOYW1lIiwiaWQiLCJjaGVja0Z1bmN0aW9uIiwiZHNJZFZhbGlkYXRpb24iLCJ0b0xvd2VyQ2FzZSIsInJlcGxhY2UiLCJTeW50YXhFcnJvciJdLCJtYXBwaW5ncyI6IkFBQUE7O0FBQ0EsSUFBSUEsUUFBUUMsUUFBUSxnQkFBUixJQUE0QkQsS0FBeEM7QUFDQSxJQUFJRSxZQUFZRCxRQUFRLHdCQUFSLENBQWhCOztBQUVBO0FBQ0EsSUFBSUUsR0FBSjs7QUFFQTs7O0FBR0FDLE9BQU9DLE9BQVAsR0FBaUI7QUFDZjs7OztBQUlBQyxRQUFNLGNBQUNDLEtBQUQsRUFBVztBQUNmLFFBQUdKLFFBQVFLLFNBQVIsSUFBcUJELFVBQVVDLFNBQWxDLEVBQTZDO0FBQzNDLFVBQUcsT0FBT0QsS0FBUCxLQUFpQixRQUFwQixFQUE4QjtBQUM1QkEsZ0JBQVFMLFVBQVVPLFFBQVYsR0FBcUJGLEtBQTdCO0FBQ0QsT0FGRCxNQUdLLElBQUdBLFVBQVUsSUFBYixFQUFtQjtBQUN0QkEsZ0JBQVEsRUFBUjtBQUNELE9BRkksTUFHQSxJQUFHQSxVQUFVQyxTQUFiLEVBQXdCO0FBQzNCRCxnQkFBUUwsVUFBVU8sUUFBVixHQUFxQixTQUE3QjtBQUNEO0FBQ0ROLFlBQU1JLEtBQU47QUFDRDtBQUNELFdBQU9KLEdBQVA7QUFDRCxHQW5CYzs7QUFxQmY7Ozs7QUFJQU8sV0FBUyxpQkFBQ0MsT0FBRCxFQUFhO0FBQUU7QUFDdEIsUUFBSUMsVUFBVVYsVUFBVVcsU0FBVixHQUFzQixvQkFBdEIsR0FBNkNYLFVBQVVPLFFBQXZELEdBQWtFLFNBQWhGO0FBQ0EsUUFBSUssZUFBZUMsT0FBT0osV0FBVyxJQUFYLEdBQWtCQSxPQUFsQixHQUE0QixDQUFuQyxLQUF5QyxJQUE1RCxDQUZvQixDQUU4QztBQUNsRSxXQUFPLElBQUlLLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDdEMsVUFBSSxPQUFPQyxjQUFQLEtBQTBCLFdBQTlCLEVBQTJDO0FBQUU7QUFDM0MsWUFBSUMsUUFBUSxJQUFJRCxjQUFKLEVBQVo7QUFDQSxZQUFJRSxhQUFhQyxXQUFXLFlBQU07QUFDaENGLGdCQUFNRyxLQUFOO0FBQ0FOLGtCQUFRLEtBQVI7QUFDRCxTQUhnQixFQUdkSCxZQUhjLENBQWpCO0FBSUFNLGNBQU1JLElBQU4sQ0FBVyxLQUFYLEVBQWtCWixPQUFsQjtBQUNBUSxjQUFNSyxrQkFBTixHQUEyQixZQUFNO0FBQy9CLGNBQUlMLE1BQU1NLFVBQU4sS0FBcUJQLGVBQWVRLElBQXBDLElBQTRDUCxNQUFNUSxNQUFOLEtBQWlCLEdBQWpFLEVBQXNFO0FBQ3BFQyx5QkFBYVIsVUFBYjtBQUNBSixvQkFBUSxJQUFSO0FBQ0Q7QUFDRixTQUxEO0FBTUFHLGNBQU1VLElBQU47QUFDRCxPQWRELE1BY087QUFBRTtBQUNQLFlBQUlULGFBQWFDLFdBQVcsWUFBTTtBQUNoQ0wsa0JBQVEsS0FBUjtBQUNELFNBRmdCLEVBRWRILFlBRmMsQ0FBakI7QUFHQWQsY0FBTVksT0FBTixFQUFlO0FBQ1htQixrQkFBUSxLQURHO0FBRVhwQixtQkFBU0c7QUFGRSxTQUFmLEVBSUdrQixJQUpILENBSVEsb0JBQVk7QUFDaEIsY0FBSUMsU0FBU0wsTUFBVCxLQUFvQixHQUF4QixFQUE2QjtBQUMzQkMseUJBQWFSLFVBQWI7QUFDQUosb0JBQVEsSUFBUjtBQUNELFdBSEQsTUFHTztBQUNMWSx5QkFBYVIsVUFBYjtBQUNBSixvQkFBUSxLQUFSO0FBQ0Q7QUFDRixTQVpILEVBYUdpQixLQWJILENBYVMsYUFBSztBQUNWTCx1QkFBYVIsVUFBYjtBQUNBSixrQkFBUSxLQUFSO0FBQ0QsU0FoQkg7QUFpQkQ7QUFDRixLQXJDTSxDQUFQO0FBc0NELEdBbEVjOztBQW9FZjs7Ozs7QUFLQWtCLGVBQWEscUJBQUNDLFVBQUQsRUFBYUMsRUFBYixFQUFvQjtBQUMvQixRQUFJQyxnQkFBZ0JwQyxVQUFVcUMsY0FBVixDQUNsQkgsV0FDR0ksV0FESCxHQUNpQjtBQURqQixLQUVHQyxPQUZILENBRVcsZUFGWCxFQUU0QixFQUY1QixDQURrQixDQUdjO0FBSGQsS0FBcEI7QUFLQSxRQUFJLE9BQU9ILGFBQVAsS0FBeUIsVUFBN0IsRUFBeUM7QUFDdkMsYUFBT0EsY0FBY0QsRUFBZCxDQUFQO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsWUFBTSxJQUFJSyxXQUFKLENBQWdCTixhQUFhLHVCQUE3QixDQUFOO0FBQ0Q7QUFDRjtBQXBGYyxDQUFqQiIsImZpbGUiOiJ1dGlsaXRpZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG52YXIgZmV0Y2ggPSByZXF1aXJlKCdmZXRjaC1wb255ZmlsbCcpKCkuZmV0Y2g7XG52YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9wcml2YXRlL2NvbnN0YW50cy5qcycpO1xuXG4vLyBEZWNsYXJlIHByaXZhdGUgdmFyaWFibGVzXG52YXIgX2lkO1xuXG4vKipcbiAqIEBtb2R1bGUgdXRpbGl0aWVzXG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtuZXdJZF0gLSBJZiBnaXZlbiBzdHJpbmcsIHNldHMgYSBuZXcgdXNlciBJRC4gSWYgbnVsbCwgdHVybnMgb2YgdXNlciBpZC4gRWxzZSBzaW1wbHkgcmV0dXJucyBjdXJyZW50IElELlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IGlkIC0gQ3VycmVudCB1c2VyIElEXG4gICAqL1xuICB1c2VyOiAobmV3SWQpID0+IHtcbiAgICBpZihfaWQgPT09IHVuZGVmaW5lZCB8fCBuZXdJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZih0eXBlb2YgbmV3SWQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgbmV3SWQgPSBjb25zdGFudHMuaWRQcmVmaXggKyBuZXdJZDtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYobmV3SWQgPT09IG51bGwpIHtcbiAgICAgICAgbmV3SWQgPSBcIlwiO1xuICAgICAgfVxuICAgICAgZWxzZSBpZihuZXdJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG5ld0lkID0gY29uc3RhbnRzLmlkUHJlZml4ICsgXCJkZWZhdWx0XCI7XG4gICAgICB9XG4gICAgICBfaWQgPSBuZXdJZDtcbiAgICB9XG4gICAgcmV0dXJuIF9pZDtcbiAgfSxcblxuICAvKipcbiAgICogQHBhcmFtIHtudW1iZXJ9IFt0aW1lb3V0PTEwMDBdIFNldHMgbGVuZ3RoIG9mIHRpbWUgYmVmb3JlIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IFBDMiBTdGF0dXNcbiAgICovXG4gIHBjQ2hlY2s6ICh0aW1lb3V0KSA9PiB7IC8vIHRpbWVvdXQgaXMgaW4gbWlsbGlzZWNvbmRzXG4gICAgdmFyIGFkZHJlc3MgPSBjb25zdGFudHMucGNBZGRyZXNzICsgXCJzZWFyY2g/cT1wNTMmdXNlcj1cIiArIGNvbnN0YW50cy5pZFByZWZpeCArIFwicGNDaGVja1wiO1xuICAgIHZhciB0aW1lb3V0VmFsdWUgPSBOdW1iZXIodGltZW91dCAhPSBudWxsID8gdGltZW91dCA6IDApIHx8IDEwMDA7IC8vIGRlZmF1bHQgdGltZW91dCBpcyAxMDAwbXNcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCAhPT0gXCJ1bmRlZmluZWRcIikgeyAvLyBBc3N1bWUgYnJvd3NlcnNpZGU6IGRvbmUgdXNpbmcgeGhyIGJlY2F1c2UgbmV0d29yayBjb25uZWN0aW9ucyBjYW5jZWxsYWJsZVxuICAgICAgICB2YXIgeGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgdmFyIHRpbWVvdXRSZWYgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB4aHR0cC5hYm9ydCgpO1xuICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICB9LCB0aW1lb3V0VmFsdWUpO1xuICAgICAgICB4aHR0cC5vcGVuKFwiR0VUXCIsIGFkZHJlc3MpO1xuICAgICAgICB4aHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgaWYgKHhodHRwLnJlYWR5U3RhdGUgPT09IFhNTEh0dHBSZXF1ZXN0LkRPTkUgJiYgeGh0dHAuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0UmVmKTtcbiAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB4aHR0cC5zZW5kKCk7XG4gICAgICB9IGVsc2UgeyAvLyBBc3N1bWUgc2VydmVyc2lkZTogZG9uZSB1c2luZyBmZXRjaCBhcyBwb255ZmlsbCBhbHJlYWR5IGF2YWlsYWJsZSBhbmQgcmVzaWR1YWwgbmV0d29yayBjb25uZWN0aW9ucyBpbW1hdGVyaWFsXG4gICAgICAgIHZhciB0aW1lb3V0UmVmID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgIH0sIHRpbWVvdXRWYWx1ZSk7XG4gICAgICAgIGZldGNoKGFkZHJlc3MsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ2dldCcsXG4gICAgICAgICAgICB0aW1lb3V0OiB0aW1lb3V0VmFsdWVcbiAgICAgICAgICB9KVxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dFJlZik7XG4gICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dFJlZik7XG4gICAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRSZWYpO1xuICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzb3VyY2VOYW1lIC0gTmFtZSBvZiBzb3VyY2UgdHlwZSB0byB2YWxpZGF0ZSBhZ2FpbnN0IChlZy4gdW5pcHJvdClcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkIC0gSUQgdG8gdmFsaWRhdGVcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gaWRWYWxpZGl0eVxuICAgKi9cbiAgc291cmNlQ2hlY2s6IChzb3VyY2VOYW1lLCBpZCkgPT4ge1xuICAgIHZhciBjaGVja0Z1bmN0aW9uID0gY29uc3RhbnRzLmRzSWRWYWxpZGF0aW9uW1xuICAgICAgc291cmNlTmFtZVxuICAgICAgICAudG9Mb3dlckNhc2UoKSAvLyBNYWtlIGFsbCBsb3dlcmNhc2VcbiAgICAgICAgLnJlcGxhY2UoL1teYS16QS1aMC05XS9nLCBcIlwiKSAvLyBSZW1vdmUgYW55IG5vbiBsZXR0ZXIgb3IgbnVtYmVyIHN5bWJvbHNcbiAgICBdO1xuICAgIGlmICh0eXBlb2YgY2hlY2tGdW5jdGlvbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICByZXR1cm4gY2hlY2tGdW5jdGlvbihpZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihzb3VyY2VOYW1lICsgXCIgaXMgYW4gaW52YWxpZCBzb3VyY2VcIik7XG4gICAgfVxuICB9XG59XG4iXX0=