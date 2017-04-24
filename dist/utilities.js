'use strict';

var fetch = require('fetch-ponyfill')().fetch;
var uuidV4 = require('uuid/v4');
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
        newId = constants.idPrefix + uuidV4();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxpdGllcy5qcyJdLCJuYW1lcyI6WyJmZXRjaCIsInJlcXVpcmUiLCJ1dWlkVjQiLCJjb25zdGFudHMiLCJfaWQiLCJtb2R1bGUiLCJleHBvcnRzIiwidXNlciIsIm5ld0lkIiwidW5kZWZpbmVkIiwiaWRQcmVmaXgiLCJwY0NoZWNrIiwidGltZW91dCIsImFkZHJlc3MiLCJwY0FkZHJlc3MiLCJ0aW1lb3V0VmFsdWUiLCJOdW1iZXIiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIlhNTEh0dHBSZXF1ZXN0IiwieGh0dHAiLCJ0aW1lb3V0UmVmIiwic2V0VGltZW91dCIsImFib3J0Iiwib3BlbiIsIm9ucmVhZHlzdGF0ZWNoYW5nZSIsInJlYWR5U3RhdGUiLCJET05FIiwic3RhdHVzIiwiY2xlYXJUaW1lb3V0Iiwic2VuZCIsIm1ldGhvZCIsInRoZW4iLCJyZXNwb25zZSIsImNhdGNoIiwic291cmNlQ2hlY2siLCJzb3VyY2VOYW1lIiwiaWQiLCJjaGVja0Z1bmN0aW9uIiwiZHNJZFZhbGlkYXRpb24iLCJ0b0xvd2VyQ2FzZSIsInJlcGxhY2UiLCJTeW50YXhFcnJvciJdLCJtYXBwaW5ncyI6IkFBQUE7O0FBQ0EsSUFBSUEsUUFBUUMsUUFBUSxnQkFBUixJQUE0QkQsS0FBeEM7QUFDQSxJQUFJRSxTQUFTRCxRQUFRLFNBQVIsQ0FBYjtBQUNBLElBQUlFLFlBQVlGLFFBQVEsd0JBQVIsQ0FBaEI7O0FBRUE7QUFDQSxJQUFJRyxHQUFKOztBQUVBOzs7QUFHQUMsT0FBT0MsT0FBUCxHQUFpQjtBQUNmOzs7O0FBSUFDLFFBQU0sY0FBQ0MsS0FBRCxFQUFXO0FBQ2YsUUFBR0osUUFBUUssU0FBUixJQUFxQkQsVUFBVUMsU0FBbEMsRUFBNkM7QUFDM0MsVUFBRyxPQUFPRCxLQUFQLEtBQWlCLFFBQXBCLEVBQThCO0FBQzVCQSxnQkFBUUwsVUFBVU8sUUFBVixHQUFxQkYsS0FBN0I7QUFDRCxPQUZELE1BR0ssSUFBR0EsVUFBVSxJQUFiLEVBQW1CO0FBQ3RCQSxnQkFBUSxFQUFSO0FBQ0QsT0FGSSxNQUdBLElBQUdBLFVBQVVDLFNBQWIsRUFBd0I7QUFDM0JELGdCQUFRTCxVQUFVTyxRQUFWLEdBQXFCUixRQUE3QjtBQUNEO0FBQ0RFLFlBQU1JLEtBQU47QUFDRDtBQUNELFdBQU9KLEdBQVA7QUFDRCxHQW5CYzs7QUFxQmY7Ozs7QUFJQU8sV0FBUyxpQkFBQ0MsT0FBRCxFQUFhO0FBQUU7QUFDdEIsUUFBSUMsVUFBVVYsVUFBVVcsU0FBVixHQUFzQixvQkFBdEIsR0FBNkNYLFVBQVVPLFFBQXZELEdBQWtFLFNBQWhGO0FBQ0EsUUFBSUssZUFBZUMsT0FBT0osV0FBVyxJQUFYLEdBQWtCQSxPQUFsQixHQUE0QixDQUFuQyxLQUF5QyxJQUE1RCxDQUZvQixDQUU4QztBQUNsRSxXQUFPLElBQUlLLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDdEMsVUFBSSxPQUFPQyxjQUFQLEtBQTBCLFdBQTlCLEVBQTJDO0FBQUU7QUFDM0MsWUFBSUMsUUFBUSxJQUFJRCxjQUFKLEVBQVo7QUFDQSxZQUFJRSxhQUFhQyxXQUFXLFlBQU07QUFDaENGLGdCQUFNRyxLQUFOO0FBQ0FOLGtCQUFRLEtBQVI7QUFDRCxTQUhnQixFQUdkSCxZQUhjLENBQWpCO0FBSUFNLGNBQU1JLElBQU4sQ0FBVyxLQUFYLEVBQWtCWixPQUFsQjtBQUNBUSxjQUFNSyxrQkFBTixHQUEyQixZQUFNO0FBQy9CLGNBQUlMLE1BQU1NLFVBQU4sS0FBcUJQLGVBQWVRLElBQXBDLElBQTRDUCxNQUFNUSxNQUFOLEtBQWlCLEdBQWpFLEVBQXNFO0FBQ3BFQyx5QkFBYVIsVUFBYjtBQUNBSixvQkFBUSxJQUFSO0FBQ0Q7QUFDRixTQUxEO0FBTUFHLGNBQU1VLElBQU47QUFDRCxPQWRELE1BY087QUFBRTtBQUNQLFlBQUlULGFBQWFDLFdBQVcsWUFBTTtBQUNoQ0wsa0JBQVEsS0FBUjtBQUNELFNBRmdCLEVBRWRILFlBRmMsQ0FBakI7QUFHQWYsY0FBTWEsT0FBTixFQUFlO0FBQ1htQixrQkFBUSxLQURHO0FBRVhwQixtQkFBU0c7QUFGRSxTQUFmLEVBSUdrQixJQUpILENBSVEsb0JBQVk7QUFDaEIsY0FBSUMsU0FBU0wsTUFBVCxLQUFvQixHQUF4QixFQUE2QjtBQUMzQkMseUJBQWFSLFVBQWI7QUFDQUosb0JBQVEsSUFBUjtBQUNELFdBSEQsTUFHTztBQUNMWSx5QkFBYVIsVUFBYjtBQUNBSixvQkFBUSxLQUFSO0FBQ0Q7QUFDRixTQVpILEVBYUdpQixLQWJILENBYVMsYUFBSztBQUNWTCx1QkFBYVIsVUFBYjtBQUNBSixrQkFBUSxLQUFSO0FBQ0QsU0FoQkg7QUFpQkQ7QUFDRixLQXJDTSxDQUFQO0FBc0NELEdBbEVjOztBQW9FZjs7Ozs7QUFLQWtCLGVBQWEscUJBQUNDLFVBQUQsRUFBYUMsRUFBYixFQUFvQjtBQUMvQixRQUFJQyxnQkFBZ0JwQyxVQUFVcUMsY0FBVixDQUNsQkgsV0FDR0ksV0FESCxHQUNpQjtBQURqQixLQUVHQyxPQUZILENBRVcsZUFGWCxFQUU0QixFQUY1QixDQURrQixDQUdjO0FBSGQsS0FBcEI7QUFLQSxRQUFJLE9BQU9ILGFBQVAsS0FBeUIsVUFBN0IsRUFBeUM7QUFDdkMsYUFBT0EsY0FBY0QsRUFBZCxDQUFQO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsWUFBTSxJQUFJSyxXQUFKLENBQWdCTixhQUFhLHVCQUE3QixDQUFOO0FBQ0Q7QUFDRjtBQXBGYyxDQUFqQiIsImZpbGUiOiJ1dGlsaXRpZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG52YXIgZmV0Y2ggPSByZXF1aXJlKCdmZXRjaC1wb255ZmlsbCcpKCkuZmV0Y2g7XG52YXIgdXVpZFY0ID0gcmVxdWlyZSgndXVpZC92NCcpO1xudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoJy4vcHJpdmF0ZS9jb25zdGFudHMuanMnKTtcblxuLy8gRGVjbGFyZSBwcml2YXRlIHZhcmlhYmxlc1xudmFyIF9pZDtcblxuLyoqXG4gKiBAbW9kdWxlIHV0aWxpdGllc1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbbmV3SWRdIC0gSWYgZ2l2ZW4gc3RyaW5nLCBzZXRzIGEgbmV3IHVzZXIgSUQuIElmIG51bGwsIHR1cm5zIG9mIHVzZXIgaWQuIEVsc2Ugc2ltcGx5IHJldHVybnMgY3VycmVudCBJRC5cbiAgICogQHJldHVybiB7c3RyaW5nfSBpZCAtIEN1cnJlbnQgdXNlciBJRFxuICAgKi9cbiAgdXNlcjogKG5ld0lkKSA9PiB7XG4gICAgaWYoX2lkID09PSB1bmRlZmluZWQgfHwgbmV3SWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYodHlwZW9mIG5ld0lkID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIG5ld0lkID0gY29uc3RhbnRzLmlkUHJlZml4ICsgbmV3SWQ7XG4gICAgICB9XG4gICAgICBlbHNlIGlmKG5ld0lkID09PSBudWxsKSB7XG4gICAgICAgIG5ld0lkID0gXCJcIjtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYobmV3SWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBuZXdJZCA9IGNvbnN0YW50cy5pZFByZWZpeCArIHV1aWRWNCgpO1xuICAgICAgfVxuICAgICAgX2lkID0gbmV3SWQ7XG4gICAgfVxuICAgIHJldHVybiBfaWQ7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbdGltZW91dD0xMDAwXSBTZXRzIGxlbmd0aCBvZiB0aW1lIGJlZm9yZSB0aW1lb3V0IGluIG1pbGxpc2Vjb25kc1xuICAgKiBAcmV0dXJuIHtib29sZWFufSBQQzIgU3RhdHVzXG4gICAqL1xuICBwY0NoZWNrOiAodGltZW91dCkgPT4geyAvLyB0aW1lb3V0IGlzIGluIG1pbGxpc2Vjb25kc1xuICAgIHZhciBhZGRyZXNzID0gY29uc3RhbnRzLnBjQWRkcmVzcyArIFwic2VhcmNoP3E9cDUzJnVzZXI9XCIgKyBjb25zdGFudHMuaWRQcmVmaXggKyBcInBjQ2hlY2tcIjtcbiAgICB2YXIgdGltZW91dFZhbHVlID0gTnVtYmVyKHRpbWVvdXQgIT0gbnVsbCA/IHRpbWVvdXQgOiAwKSB8fCAxMDAwOyAvLyBkZWZhdWx0IHRpbWVvdXQgaXMgMTAwMG1zXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT09IFwidW5kZWZpbmVkXCIpIHsgLy8gQXNzdW1lIGJyb3dzZXJzaWRlOiBkb25lIHVzaW5nIHhociBiZWNhdXNlIG5ldHdvcmsgY29ubmVjdGlvbnMgY2FuY2VsbGFibGVcbiAgICAgICAgdmFyIHhodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHZhciB0aW1lb3V0UmVmID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgeGh0dHAuYWJvcnQoKTtcbiAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgfSwgdGltZW91dFZhbHVlKTtcbiAgICAgICAgeGh0dHAub3BlbihcIkdFVFwiLCBhZGRyZXNzKTtcbiAgICAgICAgeGh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgIGlmICh4aHR0cC5yZWFkeVN0YXRlID09PSBYTUxIdHRwUmVxdWVzdC5ET05FICYmIHhodHRwLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dFJlZik7XG4gICAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgeGh0dHAuc2VuZCgpO1xuICAgICAgfSBlbHNlIHsgLy8gQXNzdW1lIHNlcnZlcnNpZGU6IGRvbmUgdXNpbmcgZmV0Y2ggYXMgcG9ueWZpbGwgYWxyZWFkeSBhdmFpbGFibGUgYW5kIHJlc2lkdWFsIG5ldHdvcmsgY29ubmVjdGlvbnMgaW1tYXRlcmlhbFxuICAgICAgICB2YXIgdGltZW91dFJlZiA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICB9LCB0aW1lb3V0VmFsdWUpO1xuICAgICAgICBmZXRjaChhZGRyZXNzLCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdnZXQnLFxuICAgICAgICAgICAgdGltZW91dDogdGltZW91dFZhbHVlXG4gICAgICAgICAgfSlcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRSZWYpO1xuICAgICAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRSZWYpO1xuICAgICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaChlID0+IHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0UmVmKTtcbiAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc291cmNlTmFtZSAtIE5hbWUgb2Ygc291cmNlIHR5cGUgdG8gdmFsaWRhdGUgYWdhaW5zdCAoZWcuIHVuaXByb3QpXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZCAtIElEIHRvIHZhbGlkYXRlXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IGlkVmFsaWRpdHlcbiAgICovXG4gIHNvdXJjZUNoZWNrOiAoc291cmNlTmFtZSwgaWQpID0+IHtcbiAgICB2YXIgY2hlY2tGdW5jdGlvbiA9IGNvbnN0YW50cy5kc0lkVmFsaWRhdGlvbltcbiAgICAgIHNvdXJjZU5hbWVcbiAgICAgICAgLnRvTG93ZXJDYXNlKCkgLy8gTWFrZSBhbGwgbG93ZXJjYXNlXG4gICAgICAgIC5yZXBsYWNlKC9bXmEtekEtWjAtOV0vZywgXCJcIikgLy8gUmVtb3ZlIGFueSBub24gbGV0dGVyIG9yIG51bWJlciBzeW1ib2xzXG4gICAgXTtcbiAgICBpZiAodHlwZW9mIGNoZWNrRnVuY3Rpb24gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgcmV0dXJuIGNoZWNrRnVuY3Rpb24oaWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3Ioc291cmNlTmFtZSArIFwiIGlzIGFuIGludmFsaWQgc291cmNlXCIpO1xuICAgIH1cbiAgfVxufVxuIl19