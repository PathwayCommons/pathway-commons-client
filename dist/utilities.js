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
    var checkFunction = module.exports[sourceName.toLowerCase() + "Check"];
    if (typeof checkFunction === "function" && sourceName !== "source") {
      return checkFunction(id);
    } else {
      throw new SyntaxError(sourceName + " is an invalid source");
    }
  },

  /**
   * @param {string} uniprotId
   * @return {boolean} idValidity
   */
  uniprotCheck: function uniprotCheck(uniprodId) {
    return (/^([A-N,R-Z][0-9]([A-Z][A-Z, 0-9][A-Z, 0-9][0-9]){1,2})|([O,P,Q][0-9][A-Z, 0-9][A-Z, 0-9][A-Z, 0-9][0-9])(\.\d+)?$/.test(uniprodId)
    );
  },

  /**
   * @param {string} chebiId
   * @return {boolean} idValidity
   */
  chebiCheck: function chebiCheck(chebiId) {
    return (/^CHEBI:\d+$/.test(chebiId) && chebiId.length <= "CHEBI:".length + 6
    );
  },

  /**
   * @param {string} hgncId
   * @return {boolean} idValidity
   */
  hgncCheck: function hgncCheck(hgncId) {
    return (/^[A-Za-z-0-9_]+(\@)?$/.test(hgncId)
    );
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxpdGllcy5qcyJdLCJuYW1lcyI6WyJmZXRjaCIsInJlcXVpcmUiLCJjb25zdGFudHMiLCJtb2R1bGUiLCJleHBvcnRzIiwicGNDaGVjayIsInRpbWVvdXQiLCJhZGRyZXNzIiwicGNBZGRyZXNzIiwidGltZW91dFZhbHVlIiwiTnVtYmVyIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJYTUxIdHRwUmVxdWVzdCIsInhodHRwIiwidGltZW91dFJlZiIsInNldFRpbWVvdXQiLCJhYm9ydCIsIm9wZW4iLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJyZWFkeVN0YXRlIiwiRE9ORSIsInN0YXR1cyIsImNsZWFyVGltZW91dCIsInNlbmQiLCJtZXRob2QiLCJ0aGVuIiwicmVzcG9uc2UiLCJjYXRjaCIsInNvdXJjZUNoZWNrIiwic291cmNlTmFtZSIsImlkIiwiY2hlY2tGdW5jdGlvbiIsInRvTG93ZXJDYXNlIiwiU3ludGF4RXJyb3IiLCJ1bmlwcm90Q2hlY2siLCJ1bmlwcm9kSWQiLCJ0ZXN0IiwiY2hlYmlDaGVjayIsImNoZWJpSWQiLCJsZW5ndGgiLCJoZ25jQ2hlY2siLCJoZ25jSWQiXSwibWFwcGluZ3MiOiJBQUFBOztBQUNBLElBQUlBLFFBQVFDLFFBQVEsZ0JBQVIsSUFBNEJELEtBQXhDO0FBQ0EsSUFBSUUsWUFBWUQsUUFBUSx3QkFBUixDQUFoQjs7QUFFQUUsT0FBT0MsT0FBUCxHQUFpQjtBQUNmOzs7O0FBSUFDLFdBQVMsaUJBQUNDLE9BQUQsRUFBYTtBQUFFO0FBQ3RCLFFBQUlDLFVBQVVMLFVBQVVNLFNBQXhCO0FBQ0EsUUFBSUMsZUFBZUMsT0FBT0osV0FBVyxJQUFYLEdBQWtCQSxPQUFsQixHQUE0QixDQUFuQyxLQUF5QyxJQUE1RCxDQUZvQixDQUU4QztBQUNsRSxXQUFPLElBQUlLLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDdEMsVUFBSSxPQUFPQyxjQUFQLEtBQTBCLFdBQTlCLEVBQTJDO0FBQUU7QUFDM0MsWUFBSUMsUUFBUSxJQUFJRCxjQUFKLEVBQVo7QUFDQSxZQUFJRSxhQUFhQyxXQUFXLFlBQU07QUFDaENGLGdCQUFNRyxLQUFOO0FBQ0FOLGtCQUFRLEtBQVI7QUFDRCxTQUhnQixFQUdkSCxZQUhjLENBQWpCO0FBSUFNLGNBQU1JLElBQU4sQ0FBVyxLQUFYLEVBQWtCWixPQUFsQjtBQUNBUSxjQUFNSyxrQkFBTixHQUEyQixZQUFNO0FBQy9CLGNBQUlMLE1BQU1NLFVBQU4sS0FBcUJQLGVBQWVRLElBQXBDLElBQTRDUCxNQUFNUSxNQUFOLEtBQWlCLEdBQWpFLEVBQXNFO0FBQ3BFQyx5QkFBYVIsVUFBYjtBQUNBSixvQkFBUSxJQUFSO0FBQ0Q7QUFDRixTQUxEO0FBTUFHLGNBQU1VLElBQU47QUFDRCxPQWRELE1BY087QUFBRTtBQUNQLFlBQUlULGFBQWFDLFdBQVcsWUFBTTtBQUNoQ0wsa0JBQVEsS0FBUjtBQUNELFNBRmdCLEVBRWRILFlBRmMsQ0FBakI7QUFHQVQsY0FBTU8sT0FBTixFQUFlO0FBQ1htQixrQkFBUSxLQURHO0FBRVhwQixtQkFBU0c7QUFGRSxTQUFmLEVBSUdrQixJQUpILENBSVEsb0JBQVk7QUFDaEIsY0FBSUMsU0FBU0wsTUFBVCxLQUFvQixHQUF4QixFQUE2QjtBQUMzQkMseUJBQWFSLFVBQWI7QUFDQUosb0JBQVEsSUFBUjtBQUNELFdBSEQsTUFHTztBQUNMWSx5QkFBYVIsVUFBYjtBQUNBSixvQkFBUSxLQUFSO0FBQ0Q7QUFDRixTQVpILEVBYUdpQixLQWJILENBYVMsYUFBSztBQUNWTCx1QkFBYVIsVUFBYjtBQUNBSixrQkFBUSxLQUFSO0FBQ0QsU0FoQkg7QUFpQkQ7QUFDRixLQXJDTSxDQUFQO0FBc0NELEdBOUNjOztBQWdEZjs7Ozs7QUFLQWtCLGVBQWEscUJBQUNDLFVBQUQsRUFBYUMsRUFBYixFQUFvQjtBQUMvQixRQUFJQyxnQkFBZ0I5QixPQUFPQyxPQUFQLENBQWUyQixXQUFXRyxXQUFYLEtBQTJCLE9BQTFDLENBQXBCO0FBQ0EsUUFBSyxPQUFPRCxhQUFQLEtBQXlCLFVBQTFCLElBQTBDRixlQUFlLFFBQTdELEVBQXdFO0FBQ3RFLGFBQU9FLGNBQWNELEVBQWQsQ0FBUDtBQUNELEtBRkQsTUFFTztBQUNMLFlBQU0sSUFBSUcsV0FBSixDQUFnQkosYUFBYSx1QkFBN0IsQ0FBTjtBQUNEO0FBQ0YsR0E1RGM7O0FBOERmOzs7O0FBSUFLLGdCQUFjLHNCQUFDQyxTQUFELEVBQWU7QUFDM0IsV0FBTyxxSEFBb0hDLElBQXBILENBQXlIRCxTQUF6SDtBQUFQO0FBQ0QsR0FwRWM7O0FBc0VmOzs7O0FBSUFFLGNBQVksb0JBQUNDLE9BQUQsRUFBYTtBQUN2QixXQUFPLGVBQWNGLElBQWQsQ0FBbUJFLE9BQW5CLEtBQWdDQSxRQUFRQyxNQUFSLElBQW1CLFNBQVNBLE1BQVQsR0FBa0I7QUFBNUU7QUFDRCxHQTVFYzs7QUE4RWY7Ozs7QUFJQUMsYUFBVyxtQkFBQ0MsTUFBRCxFQUFZO0FBQ3JCLFdBQU8seUJBQXdCTCxJQUF4QixDQUE2QkssTUFBN0I7QUFBUDtBQUNEO0FBcEZjLENBQWpCIiwiZmlsZSI6InV0aWxpdGllcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcbnZhciBmZXRjaCA9IHJlcXVpcmUoJ2ZldGNoLXBvbnlmaWxsJykoKS5mZXRjaDtcbnZhciBjb25zdGFudHMgPSByZXF1aXJlKCcuL3ByaXZhdGUvY29uc3RhbnRzLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAvKipcbiAgICogQHBhcmFtIHtudW1iZXJ9IHRpbWVvdXRcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gUEMyIFN0YXR1c1xuICAgKi9cbiAgcGNDaGVjazogKHRpbWVvdXQpID0+IHsgLy8gdGltZW91dCBpcyBpbiBtaWxsaXNlY29uZHNcbiAgICB2YXIgYWRkcmVzcyA9IGNvbnN0YW50cy5wY0FkZHJlc3M7XG4gICAgdmFyIHRpbWVvdXRWYWx1ZSA9IE51bWJlcih0aW1lb3V0ICE9IG51bGwgPyB0aW1lb3V0IDogMCkgfHwgMTAwMDsgLy8gZGVmYXVsdCB0aW1lb3V0IGlzIDEwMDBtc1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZiAodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ICE9PSBcInVuZGVmaW5lZFwiKSB7IC8vIEFzc3VtZSBicm93c2Vyc2lkZTogZG9uZSB1c2luZyB4aHIgYmVjYXVzZSBuZXR3b3JrIGNvbm5lY3Rpb25zIGNhbmNlbGxhYmxlXG4gICAgICAgIHZhciB4aHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB2YXIgdGltZW91dFJlZiA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHhodHRwLmFib3J0KCk7XG4gICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgIH0sIHRpbWVvdXRWYWx1ZSk7XG4gICAgICAgIHhodHRwLm9wZW4oXCJHRVRcIiwgYWRkcmVzcyk7XG4gICAgICAgIHhodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICBpZiAoeGh0dHAucmVhZHlTdGF0ZSA9PT0gWE1MSHR0cFJlcXVlc3QuRE9ORSAmJiB4aHR0cC5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRSZWYpO1xuICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHhodHRwLnNlbmQoKTtcbiAgICAgIH0gZWxzZSB7IC8vIEFzc3VtZSBzZXJ2ZXJzaWRlOiBkb25lIHVzaW5nIGZldGNoIGFzIHBvbnlmaWxsIGFscmVhZHkgYXZhaWxhYmxlIGFuZCByZXNpZHVhbCBuZXR3b3JrIGNvbm5lY3Rpb25zIGltbWF0ZXJpYWxcbiAgICAgICAgdmFyIHRpbWVvdXRSZWYgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgfSwgdGltZW91dFZhbHVlKTtcbiAgICAgICAgZmV0Y2goYWRkcmVzcywge1xuICAgICAgICAgICAgbWV0aG9kOiAnZ2V0JyxcbiAgICAgICAgICAgIHRpbWVvdXQ6IHRpbWVvdXRWYWx1ZVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0UmVmKTtcbiAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0UmVmKTtcbiAgICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dFJlZik7XG4gICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNvdXJjZU5hbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IGlkVmFsaWRpdHlcbiAgICovXG4gIHNvdXJjZUNoZWNrOiAoc291cmNlTmFtZSwgaWQpID0+IHtcbiAgICB2YXIgY2hlY2tGdW5jdGlvbiA9IG1vZHVsZS5leHBvcnRzW3NvdXJjZU5hbWUudG9Mb3dlckNhc2UoKSArIFwiQ2hlY2tcIl07XG4gICAgaWYgKCh0eXBlb2YgY2hlY2tGdW5jdGlvbiA9PT0gXCJmdW5jdGlvblwiKSAmJiAoc291cmNlTmFtZSAhPT0gXCJzb3VyY2VcIikpIHtcbiAgICAgIHJldHVybiBjaGVja0Z1bmN0aW9uKGlkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKHNvdXJjZU5hbWUgKyBcIiBpcyBhbiBpbnZhbGlkIHNvdXJjZVwiKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1bmlwcm90SWRcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gaWRWYWxpZGl0eVxuICAgKi9cbiAgdW5pcHJvdENoZWNrOiAodW5pcHJvZElkKSA9PiB7XG4gICAgcmV0dXJuIC9eKFtBLU4sUi1aXVswLTldKFtBLVpdW0EtWiwgMC05XVtBLVosIDAtOV1bMC05XSl7MSwyfSl8KFtPLFAsUV1bMC05XVtBLVosIDAtOV1bQS1aLCAwLTldW0EtWiwgMC05XVswLTldKShcXC5cXGQrKT8kLy50ZXN0KHVuaXByb2RJZCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjaGViaUlkXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IGlkVmFsaWRpdHlcbiAgICovXG4gIGNoZWJpQ2hlY2s6IChjaGViaUlkKSA9PiB7XG4gICAgcmV0dXJuIC9eQ0hFQkk6XFxkKyQvLnRlc3QoY2hlYmlJZCkgJiYgKGNoZWJpSWQubGVuZ3RoIDw9IChcIkNIRUJJOlwiLmxlbmd0aCArIDYpKTtcbiAgfSxcblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGhnbmNJZFxuICAgKiBAcmV0dXJuIHtib29sZWFufSBpZFZhbGlkaXR5XG4gICAqL1xuICBoZ25jQ2hlY2s6IChoZ25jSWQpID0+IHtcbiAgICByZXR1cm4gL15bQS1aYS16LTAtOV9dKyhcXEApPyQvLnRlc3QoaGduY0lkKTtcbiAgfVxufVxuIl19