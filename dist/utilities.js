'use strict';

var fetch = require('fetch-ponyfill')().fetch;
var constants = require('./private/constants.js');

module.exports = {
  /**
   * @param {number} timeout
   * @return {boolean} PC2 Status
   */
  pcCheck: function pcCheck(timeout) {
    // timeout is in milliseconds
    var address = constants.pcAddress;
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
   * @param {string} sourceName
   * @param {string} id
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxpdGllcy5qcyJdLCJuYW1lcyI6WyJmZXRjaCIsInJlcXVpcmUiLCJjb25zdGFudHMiLCJtb2R1bGUiLCJleHBvcnRzIiwicGNDaGVjayIsInRpbWVvdXQiLCJhZGRyZXNzIiwicGNBZGRyZXNzIiwidGltZW91dFZhbHVlIiwiTnVtYmVyIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJYTUxIdHRwUmVxdWVzdCIsInhodHRwIiwidGltZW91dFJlZiIsInNldFRpbWVvdXQiLCJhYm9ydCIsIm9wZW4iLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJyZWFkeVN0YXRlIiwiRE9ORSIsInN0YXR1cyIsImNsZWFyVGltZW91dCIsInNlbmQiLCJtZXRob2QiLCJ0aGVuIiwicmVzcG9uc2UiLCJjYXRjaCIsInNvdXJjZUNoZWNrIiwic291cmNlTmFtZSIsImlkIiwiY2hlY2tGdW5jdGlvbiIsImRzSWRWYWxpZGF0aW9uIiwidG9Mb3dlckNhc2UiLCJyZXBsYWNlIiwiU3ludGF4RXJyb3IiXSwibWFwcGluZ3MiOiJBQUFBOztBQUNBLElBQUlBLFFBQVFDLFFBQVEsZ0JBQVIsSUFBNEJELEtBQXhDO0FBQ0EsSUFBSUUsWUFBWUQsUUFBUSx3QkFBUixDQUFoQjs7QUFFQUUsT0FBT0MsT0FBUCxHQUFpQjtBQUNmOzs7O0FBSUFDLFdBQVMsaUJBQUNDLE9BQUQsRUFBYTtBQUFFO0FBQ3RCLFFBQUlDLFVBQVVMLFVBQVVNLFNBQXhCO0FBQ0EsUUFBSUMsZUFBZUMsT0FBT0osV0FBVyxJQUFYLEdBQWtCQSxPQUFsQixHQUE0QixDQUFuQyxLQUF5QyxJQUE1RCxDQUZvQixDQUU4QztBQUNsRSxXQUFPLElBQUlLLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDdEMsVUFBSSxPQUFPQyxjQUFQLEtBQTBCLFdBQTlCLEVBQTJDO0FBQUU7QUFDM0MsWUFBSUMsUUFBUSxJQUFJRCxjQUFKLEVBQVo7QUFDQSxZQUFJRSxhQUFhQyxXQUFXLFlBQU07QUFDaENGLGdCQUFNRyxLQUFOO0FBQ0FOLGtCQUFRLEtBQVI7QUFDRCxTQUhnQixFQUdkSCxZQUhjLENBQWpCO0FBSUFNLGNBQU1JLElBQU4sQ0FBVyxLQUFYLEVBQWtCWixPQUFsQjtBQUNBUSxjQUFNSyxrQkFBTixHQUEyQixZQUFNO0FBQy9CLGNBQUlMLE1BQU1NLFVBQU4sS0FBcUJQLGVBQWVRLElBQXBDLElBQTRDUCxNQUFNUSxNQUFOLEtBQWlCLEdBQWpFLEVBQXNFO0FBQ3BFQyx5QkFBYVIsVUFBYjtBQUNBSixvQkFBUSxJQUFSO0FBQ0Q7QUFDRixTQUxEO0FBTUFHLGNBQU1VLElBQU47QUFDRCxPQWRELE1BY087QUFBRTtBQUNQLFlBQUlULGFBQWFDLFdBQVcsWUFBTTtBQUNoQ0wsa0JBQVEsS0FBUjtBQUNELFNBRmdCLEVBRWRILFlBRmMsQ0FBakI7QUFHQVQsY0FBTU8sT0FBTixFQUFlO0FBQ1htQixrQkFBUSxLQURHO0FBRVhwQixtQkFBU0c7QUFGRSxTQUFmLEVBSUdrQixJQUpILENBSVEsb0JBQVk7QUFDaEIsY0FBSUMsU0FBU0wsTUFBVCxLQUFvQixHQUF4QixFQUE2QjtBQUMzQkMseUJBQWFSLFVBQWI7QUFDQUosb0JBQVEsSUFBUjtBQUNELFdBSEQsTUFHTztBQUNMWSx5QkFBYVIsVUFBYjtBQUNBSixvQkFBUSxLQUFSO0FBQ0Q7QUFDRixTQVpILEVBYUdpQixLQWJILENBYVMsYUFBSztBQUNWTCx1QkFBYVIsVUFBYjtBQUNBSixrQkFBUSxLQUFSO0FBQ0QsU0FoQkg7QUFpQkQ7QUFDRixLQXJDTSxDQUFQO0FBc0NELEdBOUNjOztBQWdEZjs7Ozs7QUFLQWtCLGVBQWEscUJBQUNDLFVBQUQsRUFBYUMsRUFBYixFQUFvQjtBQUMvQixRQUFJQyxnQkFBZ0IvQixVQUFVZ0MsY0FBVixDQUNsQkgsV0FDRUksV0FERixHQUNnQjtBQURoQixLQUVFQyxPQUZGLENBRVUsZUFGVixFQUUyQixFQUYzQixDQURrQixDQUdhO0FBSGIsS0FBcEI7QUFLQSxRQUFJLE9BQU9ILGFBQVAsS0FBeUIsVUFBN0IsRUFBeUM7QUFDdkMsYUFBT0EsY0FBY0QsRUFBZCxDQUFQO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsWUFBTSxJQUFJSyxXQUFKLENBQWdCTixhQUFhLHVCQUE3QixDQUFOO0FBQ0Q7QUFDRjtBQWhFYyxDQUFqQiIsImZpbGUiOiJ1dGlsaXRpZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG52YXIgZmV0Y2ggPSByZXF1aXJlKCdmZXRjaC1wb255ZmlsbCcpKCkuZmV0Y2g7XG52YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9wcml2YXRlL2NvbnN0YW50cy5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lb3V0XG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IFBDMiBTdGF0dXNcbiAgICovXG4gIHBjQ2hlY2s6ICh0aW1lb3V0KSA9PiB7IC8vIHRpbWVvdXQgaXMgaW4gbWlsbGlzZWNvbmRzXG4gICAgdmFyIGFkZHJlc3MgPSBjb25zdGFudHMucGNBZGRyZXNzO1xuICAgIHZhciB0aW1lb3V0VmFsdWUgPSBOdW1iZXIodGltZW91dCAhPSBudWxsID8gdGltZW91dCA6IDApIHx8IDEwMDA7IC8vIGRlZmF1bHQgdGltZW91dCBpcyAxMDAwbXNcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCAhPT0gXCJ1bmRlZmluZWRcIikgeyAvLyBBc3N1bWUgYnJvd3NlcnNpZGU6IGRvbmUgdXNpbmcgeGhyIGJlY2F1c2UgbmV0d29yayBjb25uZWN0aW9ucyBjYW5jZWxsYWJsZVxuICAgICAgICB2YXIgeGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgdmFyIHRpbWVvdXRSZWYgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB4aHR0cC5hYm9ydCgpO1xuICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICB9LCB0aW1lb3V0VmFsdWUpO1xuICAgICAgICB4aHR0cC5vcGVuKFwiR0VUXCIsIGFkZHJlc3MpO1xuICAgICAgICB4aHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgaWYgKHhodHRwLnJlYWR5U3RhdGUgPT09IFhNTEh0dHBSZXF1ZXN0LkRPTkUgJiYgeGh0dHAuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0UmVmKTtcbiAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB4aHR0cC5zZW5kKCk7XG4gICAgICB9IGVsc2UgeyAvLyBBc3N1bWUgc2VydmVyc2lkZTogZG9uZSB1c2luZyBmZXRjaCBhcyBwb255ZmlsbCBhbHJlYWR5IGF2YWlsYWJsZSBhbmQgcmVzaWR1YWwgbmV0d29yayBjb25uZWN0aW9ucyBpbW1hdGVyaWFsXG4gICAgICAgIHZhciB0aW1lb3V0UmVmID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgIH0sIHRpbWVvdXRWYWx1ZSk7XG4gICAgICAgIGZldGNoKGFkZHJlc3MsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ2dldCcsXG4gICAgICAgICAgICB0aW1lb3V0OiB0aW1lb3V0VmFsdWVcbiAgICAgICAgICB9KVxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dFJlZik7XG4gICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dFJlZik7XG4gICAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRSZWYpO1xuICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzb3VyY2VOYW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKiBAcmV0dXJuIHtib29sZWFufSBpZFZhbGlkaXR5XG4gICAqL1xuICBzb3VyY2VDaGVjazogKHNvdXJjZU5hbWUsIGlkKSA9PiB7XG4gICAgdmFyIGNoZWNrRnVuY3Rpb24gPSBjb25zdGFudHMuZHNJZFZhbGlkYXRpb25bXG4gICAgICBzb3VyY2VOYW1lXG5cdCAgICAgIC50b0xvd2VyQ2FzZSgpIC8vIE1ha2UgYWxsIGxvd2VyY2FzZVxuXHQgICAgICAucmVwbGFjZSgvW15hLXpBLVowLTldL2csIFwiXCIpIC8vIFJlbW92ZSBhbnkgbm9uIGxldHRlciBvciBudW1iZXIgc3ltYm9sc1xuICAgIF07XG4gICAgaWYgKHR5cGVvZiBjaGVja0Z1bmN0aW9uID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHJldHVybiBjaGVja0Z1bmN0aW9uKGlkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKHNvdXJjZU5hbWUgKyBcIiBpcyBhbiBpbnZhbGlkIHNvdXJjZVwiKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==