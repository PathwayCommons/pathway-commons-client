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
    var address = constants.pcAddress + "search?q=p53";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxpdGllcy5qcyJdLCJuYW1lcyI6WyJmZXRjaCIsInJlcXVpcmUiLCJ1dWlkVjQiLCJjb25zdGFudHMiLCJfaWQiLCJtb2R1bGUiLCJleHBvcnRzIiwidXNlciIsIm5ld0lkIiwidW5kZWZpbmVkIiwiaWRQcmVmaXgiLCJwY0NoZWNrIiwidGltZW91dCIsImFkZHJlc3MiLCJwY0FkZHJlc3MiLCJ0aW1lb3V0VmFsdWUiLCJOdW1iZXIiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIlhNTEh0dHBSZXF1ZXN0IiwieGh0dHAiLCJ0aW1lb3V0UmVmIiwic2V0VGltZW91dCIsImFib3J0Iiwib3BlbiIsIm9ucmVhZHlzdGF0ZWNoYW5nZSIsInJlYWR5U3RhdGUiLCJET05FIiwic3RhdHVzIiwiY2xlYXJUaW1lb3V0Iiwic2VuZCIsIm1ldGhvZCIsInRoZW4iLCJyZXNwb25zZSIsImNhdGNoIiwic291cmNlQ2hlY2siLCJzb3VyY2VOYW1lIiwiaWQiLCJjaGVja0Z1bmN0aW9uIiwiZHNJZFZhbGlkYXRpb24iLCJ0b0xvd2VyQ2FzZSIsInJlcGxhY2UiLCJTeW50YXhFcnJvciJdLCJtYXBwaW5ncyI6IkFBQUE7O0FBQ0EsSUFBSUEsUUFBUUMsUUFBUSxnQkFBUixJQUE0QkQsS0FBeEM7QUFDQSxJQUFJRSxTQUFTRCxRQUFRLFNBQVIsQ0FBYjtBQUNBLElBQUlFLFlBQVlGLFFBQVEsd0JBQVIsQ0FBaEI7O0FBRUE7QUFDQSxJQUFJRyxHQUFKOztBQUVBOzs7QUFHQUMsT0FBT0MsT0FBUCxHQUFpQjtBQUNmOzs7O0FBSUFDLFFBQU0sY0FBQ0MsS0FBRCxFQUFXO0FBQ2YsUUFBR0osUUFBUUssU0FBUixJQUFxQkQsVUFBVUMsU0FBbEMsRUFBNkM7QUFDM0MsVUFBRyxPQUFPRCxLQUFQLEtBQWlCLFFBQXBCLEVBQThCO0FBQzVCQSxnQkFBUUwsVUFBVU8sUUFBVixHQUFxQkYsS0FBN0I7QUFDRCxPQUZELE1BR0ssSUFBR0EsVUFBVSxJQUFiLEVBQW1CO0FBQ3RCQSxnQkFBUSxFQUFSO0FBQ0QsT0FGSSxNQUdBLElBQUdBLFVBQVVDLFNBQWIsRUFBd0I7QUFDM0JELGdCQUFRTCxVQUFVTyxRQUFWLEdBQXFCUixRQUE3QjtBQUNEO0FBQ0RFLFlBQU1JLEtBQU47QUFDRDtBQUNELFdBQU9KLEdBQVA7QUFDRCxHQW5CYzs7QUFxQmY7Ozs7QUFJQU8sV0FBUyxpQkFBQ0MsT0FBRCxFQUFhO0FBQUU7QUFDdEIsUUFBSUMsVUFBVVYsVUFBVVcsU0FBVixHQUFzQixjQUFwQztBQUNBLFFBQUlDLGVBQWVDLE9BQU9KLFdBQVcsSUFBWCxHQUFrQkEsT0FBbEIsR0FBNEIsQ0FBbkMsS0FBeUMsSUFBNUQsQ0FGb0IsQ0FFOEM7QUFDbEUsV0FBTyxJQUFJSyxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3RDLFVBQUksT0FBT0MsY0FBUCxLQUEwQixXQUE5QixFQUEyQztBQUFFO0FBQzNDLFlBQUlDLFFBQVEsSUFBSUQsY0FBSixFQUFaO0FBQ0EsWUFBSUUsYUFBYUMsV0FBVyxZQUFNO0FBQ2hDRixnQkFBTUcsS0FBTjtBQUNBTixrQkFBUSxLQUFSO0FBQ0QsU0FIZ0IsRUFHZEgsWUFIYyxDQUFqQjtBQUlBTSxjQUFNSSxJQUFOLENBQVcsS0FBWCxFQUFrQlosT0FBbEI7QUFDQVEsY0FBTUssa0JBQU4sR0FBMkIsWUFBTTtBQUMvQixjQUFJTCxNQUFNTSxVQUFOLEtBQXFCUCxlQUFlUSxJQUFwQyxJQUE0Q1AsTUFBTVEsTUFBTixLQUFpQixHQUFqRSxFQUFzRTtBQUNwRUMseUJBQWFSLFVBQWI7QUFDQUosb0JBQVEsSUFBUjtBQUNEO0FBQ0YsU0FMRDtBQU1BRyxjQUFNVSxJQUFOO0FBQ0QsT0FkRCxNQWNPO0FBQUU7QUFDUCxZQUFJVCxhQUFhQyxXQUFXLFlBQU07QUFDaENMLGtCQUFRLEtBQVI7QUFDRCxTQUZnQixFQUVkSCxZQUZjLENBQWpCO0FBR0FmLGNBQU1hLE9BQU4sRUFBZTtBQUNYbUIsa0JBQVEsS0FERztBQUVYcEIsbUJBQVNHO0FBRkUsU0FBZixFQUlHa0IsSUFKSCxDQUlRLG9CQUFZO0FBQ2hCLGNBQUlDLFNBQVNMLE1BQVQsS0FBb0IsR0FBeEIsRUFBNkI7QUFDM0JDLHlCQUFhUixVQUFiO0FBQ0FKLG9CQUFRLElBQVI7QUFDRCxXQUhELE1BR087QUFDTFkseUJBQWFSLFVBQWI7QUFDQUosb0JBQVEsS0FBUjtBQUNEO0FBQ0YsU0FaSCxFQWFHaUIsS0FiSCxDQWFTLGFBQUs7QUFDVkwsdUJBQWFSLFVBQWI7QUFDQUosa0JBQVEsS0FBUjtBQUNELFNBaEJIO0FBaUJEO0FBQ0YsS0FyQ00sQ0FBUDtBQXNDRCxHQWxFYzs7QUFvRWY7Ozs7O0FBS0FrQixlQUFhLHFCQUFDQyxVQUFELEVBQWFDLEVBQWIsRUFBb0I7QUFDL0IsUUFBSUMsZ0JBQWdCcEMsVUFBVXFDLGNBQVYsQ0FDbEJILFdBQ0VJLFdBREYsR0FDZ0I7QUFEaEIsS0FFRUMsT0FGRixDQUVVLGVBRlYsRUFFMkIsRUFGM0IsQ0FEa0IsQ0FHYTtBQUhiLEtBQXBCO0FBS0EsUUFBSSxPQUFPSCxhQUFQLEtBQXlCLFVBQTdCLEVBQXlDO0FBQ3ZDLGFBQU9BLGNBQWNELEVBQWQsQ0FBUDtBQUNELEtBRkQsTUFFTztBQUNMLFlBQU0sSUFBSUssV0FBSixDQUFnQk4sYUFBYSx1QkFBN0IsQ0FBTjtBQUNEO0FBQ0Y7QUFwRmMsQ0FBakIiLCJmaWxlIjoidXRpbGl0aWVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xudmFyIGZldGNoID0gcmVxdWlyZSgnZmV0Y2gtcG9ueWZpbGwnKSgpLmZldGNoO1xudmFyIHV1aWRWNCA9IHJlcXVpcmUoJ3V1aWQvdjQnKTtcbnZhciBjb25zdGFudHMgPSByZXF1aXJlKCcuL3ByaXZhdGUvY29uc3RhbnRzLmpzJyk7XG5cbi8vIERlY2xhcmUgcHJpdmF0ZSB2YXJpYWJsZXNcbnZhciBfaWQ7XG5cbi8qKlxuICogQG1vZHVsZSB1dGlsaXRpZXNcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gW25ld0lkXSAtIElmIGdpdmVuIHN0cmluZywgc2V0cyBhIG5ldyB1c2VyIElELiBJZiBudWxsLCB0dXJucyBvZiB1c2VyIGlkLiBFbHNlIHNpbXBseSByZXR1cm5zIGN1cnJlbnQgSUQuXG4gICAqIEByZXR1cm4ge3N0cmluZ30gaWQgLSBDdXJyZW50IHVzZXIgSURcbiAgICovXG4gIHVzZXI6IChuZXdJZCkgPT4ge1xuICAgIGlmKF9pZCA9PT0gdW5kZWZpbmVkIHx8IG5ld0lkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmKHR5cGVvZiBuZXdJZCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICBuZXdJZCA9IGNvbnN0YW50cy5pZFByZWZpeCArIG5ld0lkO1xuICAgICAgfVxuICAgICAgZWxzZSBpZihuZXdJZCA9PT0gbnVsbCkge1xuICAgICAgICBuZXdJZCA9IFwiXCI7XG4gICAgICB9XG4gICAgICBlbHNlIGlmKG5ld0lkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbmV3SWQgPSBjb25zdGFudHMuaWRQcmVmaXggKyB1dWlkVjQoKTtcbiAgICAgIH1cbiAgICAgIF9pZCA9IG5ld0lkO1xuICAgIH1cbiAgICByZXR1cm4gX2lkO1xuICB9LFxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge251bWJlcn0gW3RpbWVvdXQ9MTAwMF0gU2V0cyBsZW5ndGggb2YgdGltZSBiZWZvcmUgdGltZW91dCBpbiBtaWxsaXNlY29uZHNcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gUEMyIFN0YXR1c1xuICAgKi9cbiAgcGNDaGVjazogKHRpbWVvdXQpID0+IHsgLy8gdGltZW91dCBpcyBpbiBtaWxsaXNlY29uZHNcbiAgICB2YXIgYWRkcmVzcyA9IGNvbnN0YW50cy5wY0FkZHJlc3MgKyBcInNlYXJjaD9xPXA1M1wiO1xuICAgIHZhciB0aW1lb3V0VmFsdWUgPSBOdW1iZXIodGltZW91dCAhPSBudWxsID8gdGltZW91dCA6IDApIHx8IDEwMDA7IC8vIGRlZmF1bHQgdGltZW91dCBpcyAxMDAwbXNcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCAhPT0gXCJ1bmRlZmluZWRcIikgeyAvLyBBc3N1bWUgYnJvd3NlcnNpZGU6IGRvbmUgdXNpbmcgeGhyIGJlY2F1c2UgbmV0d29yayBjb25uZWN0aW9ucyBjYW5jZWxsYWJsZVxuICAgICAgICB2YXIgeGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgdmFyIHRpbWVvdXRSZWYgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB4aHR0cC5hYm9ydCgpO1xuICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICB9LCB0aW1lb3V0VmFsdWUpO1xuICAgICAgICB4aHR0cC5vcGVuKFwiR0VUXCIsIGFkZHJlc3MpO1xuICAgICAgICB4aHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgaWYgKHhodHRwLnJlYWR5U3RhdGUgPT09IFhNTEh0dHBSZXF1ZXN0LkRPTkUgJiYgeGh0dHAuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0UmVmKTtcbiAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB4aHR0cC5zZW5kKCk7XG4gICAgICB9IGVsc2UgeyAvLyBBc3N1bWUgc2VydmVyc2lkZTogZG9uZSB1c2luZyBmZXRjaCBhcyBwb255ZmlsbCBhbHJlYWR5IGF2YWlsYWJsZSBhbmQgcmVzaWR1YWwgbmV0d29yayBjb25uZWN0aW9ucyBpbW1hdGVyaWFsXG4gICAgICAgIHZhciB0aW1lb3V0UmVmID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgIH0sIHRpbWVvdXRWYWx1ZSk7XG4gICAgICAgIGZldGNoKGFkZHJlc3MsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ2dldCcsXG4gICAgICAgICAgICB0aW1lb3V0OiB0aW1lb3V0VmFsdWVcbiAgICAgICAgICB9KVxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dFJlZik7XG4gICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dFJlZik7XG4gICAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRSZWYpO1xuICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzb3VyY2VOYW1lIC0gTmFtZSBvZiBzb3VyY2UgdHlwZSB0byB2YWxpZGF0ZSBhZ2FpbnN0IChlZy4gdW5pcHJvdClcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkIC0gSUQgdG8gdmFsaWRhdGVcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gaWRWYWxpZGl0eVxuICAgKi9cbiAgc291cmNlQ2hlY2s6IChzb3VyY2VOYW1lLCBpZCkgPT4ge1xuICAgIHZhciBjaGVja0Z1bmN0aW9uID0gY29uc3RhbnRzLmRzSWRWYWxpZGF0aW9uW1xuICAgICAgc291cmNlTmFtZVxuXHQgICAgICAudG9Mb3dlckNhc2UoKSAvLyBNYWtlIGFsbCBsb3dlcmNhc2Vcblx0ICAgICAgLnJlcGxhY2UoL1teYS16QS1aMC05XS9nLCBcIlwiKSAvLyBSZW1vdmUgYW55IG5vbiBsZXR0ZXIgb3IgbnVtYmVyIHN5bWJvbHNcbiAgICBdO1xuICAgIGlmICh0eXBlb2YgY2hlY2tGdW5jdGlvbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICByZXR1cm4gY2hlY2tGdW5jdGlvbihpZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihzb3VyY2VOYW1lICsgXCIgaXMgYW4gaW52YWxpZCBzb3VyY2VcIik7XG4gICAgfVxuICB9XG59XG4iXX0=