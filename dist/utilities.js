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
          } else {
            clearTimeout(timeoutRef);
            resolve(false);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxpdGllcy5qcyJdLCJuYW1lcyI6WyJmZXRjaCIsInJlcXVpcmUiLCJjb25zdGFudHMiLCJtb2R1bGUiLCJleHBvcnRzIiwicGNDaGVjayIsInRpbWVvdXQiLCJhZGRyZXNzIiwicGNBZGRyZXNzIiwidGltZW91dFZhbHVlIiwiTnVtYmVyIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJYTUxIdHRwUmVxdWVzdCIsInhodHRwIiwidGltZW91dFJlZiIsInNldFRpbWVvdXQiLCJhYm9ydCIsIm9wZW4iLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJyZWFkeVN0YXRlIiwiRE9ORSIsInN0YXR1cyIsImNsZWFyVGltZW91dCIsInNlbmQiLCJtZXRob2QiLCJ0aGVuIiwicmVzcG9uc2UiLCJjYXRjaCIsInNvdXJjZUNoZWNrIiwic291cmNlTmFtZSIsImlkIiwiY2hlY2tGdW5jdGlvbiIsInRvTG93ZXJDYXNlIiwiU3ludGF4RXJyb3IiLCJ1bmlwcm90Q2hlY2siLCJ1bmlwcm9kSWQiLCJ0ZXN0IiwiY2hlYmlDaGVjayIsImNoZWJpSWQiLCJsZW5ndGgiLCJoZ25jQ2hlY2siLCJoZ25jSWQiXSwibWFwcGluZ3MiOiJBQUFBOztBQUNBLElBQUlBLFFBQVFDLFFBQVEsZ0JBQVIsSUFBNEJELEtBQXhDO0FBQ0EsSUFBSUUsWUFBWUQsUUFBUSx3QkFBUixDQUFoQjs7QUFFQUUsT0FBT0MsT0FBUCxHQUFpQjtBQUNmOzs7O0FBSUFDLFdBQVMsaUJBQUNDLE9BQUQsRUFBYTtBQUFFO0FBQ3RCLFFBQUlDLFVBQVVMLFVBQVVNLFNBQXhCO0FBQ0EsUUFBSUMsZUFBZUMsT0FBT0osV0FBVyxJQUFYLEdBQWtCQSxPQUFsQixHQUE0QixDQUFuQyxLQUF5QyxJQUE1RCxDQUZvQixDQUU4QztBQUNsRSxXQUFPLElBQUlLLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDdEMsVUFBSSxPQUFPQyxjQUFQLEtBQTBCLFdBQTlCLEVBQTJDO0FBQUU7QUFDM0MsWUFBSUMsUUFBUSxJQUFJRCxjQUFKLEVBQVo7QUFDQSxZQUFJRSxhQUFhQyxXQUFXLFlBQU07QUFDaENGLGdCQUFNRyxLQUFOO0FBQ0FOLGtCQUFRLEtBQVI7QUFDRCxTQUhnQixFQUdkSCxZQUhjLENBQWpCO0FBSUFNLGNBQU1JLElBQU4sQ0FBVyxLQUFYLEVBQWtCWixPQUFsQjtBQUNBUSxjQUFNSyxrQkFBTixHQUEyQixZQUFNO0FBQy9CLGNBQUlMLE1BQU1NLFVBQU4sS0FBcUJQLGVBQWVRLElBQXBDLElBQTRDUCxNQUFNUSxNQUFOLEtBQWlCLEdBQWpFLEVBQXNFO0FBQ3BFQyx5QkFBYVIsVUFBYjtBQUNBSixvQkFBUSxJQUFSO0FBQ0QsV0FIRCxNQUdPO0FBQ0xZLHlCQUFhUixVQUFiO0FBQ0FKLG9CQUFRLEtBQVI7QUFDRDtBQUNGLFNBUkQ7QUFTQUcsY0FBTVUsSUFBTjtBQUNELE9BakJELE1BaUJPO0FBQUU7QUFDUCxZQUFJVCxhQUFhQyxXQUFXLFlBQU07QUFDaENMLGtCQUFRLEtBQVI7QUFDRCxTQUZnQixFQUVkSCxZQUZjLENBQWpCO0FBR0FULGNBQU1PLE9BQU4sRUFBZTtBQUNYbUIsa0JBQVEsS0FERztBQUVYcEIsbUJBQVNHO0FBRkUsU0FBZixFQUlHa0IsSUFKSCxDQUlRLG9CQUFZO0FBQ2hCLGNBQUlDLFNBQVNMLE1BQVQsS0FBb0IsR0FBeEIsRUFBNkI7QUFDM0JDLHlCQUFhUixVQUFiO0FBQ0FKLG9CQUFRLElBQVI7QUFDRCxXQUhELE1BR087QUFDTFkseUJBQWFSLFVBQWI7QUFDQUosb0JBQVEsS0FBUjtBQUNEO0FBQ0YsU0FaSCxFQWFHaUIsS0FiSCxDQWFTLGFBQUs7QUFDVkwsdUJBQWFSLFVBQWI7QUFDQUosa0JBQVEsS0FBUjtBQUNELFNBaEJIO0FBaUJEO0FBQ0YsS0F4Q00sQ0FBUDtBQXlDRCxHQWpEYzs7QUFtRGY7Ozs7O0FBS0FrQixlQUFhLHFCQUFDQyxVQUFELEVBQWFDLEVBQWIsRUFBb0I7QUFDL0IsUUFBSUMsZ0JBQWdCOUIsT0FBT0MsT0FBUCxDQUFlMkIsV0FBV0csV0FBWCxLQUEyQixPQUExQyxDQUFwQjtBQUNBLFFBQUssT0FBT0QsYUFBUCxLQUF5QixVQUExQixJQUEwQ0YsZUFBZSxRQUE3RCxFQUF3RTtBQUN0RSxhQUFPRSxjQUFjRCxFQUFkLENBQVA7QUFDRCxLQUZELE1BRU87QUFDTCxZQUFNLElBQUlHLFdBQUosQ0FBZ0JKLGFBQWEsdUJBQTdCLENBQU47QUFDRDtBQUNGLEdBL0RjOztBQWlFZjs7OztBQUlBSyxnQkFBYyxzQkFBQ0MsU0FBRCxFQUFlO0FBQzNCLFdBQU8scUhBQW9IQyxJQUFwSCxDQUF5SEQsU0FBekg7QUFBUDtBQUNELEdBdkVjOztBQXlFZjs7OztBQUlBRSxjQUFZLG9CQUFDQyxPQUFELEVBQWE7QUFDdkIsV0FBTyxlQUFjRixJQUFkLENBQW1CRSxPQUFuQixLQUFnQ0EsUUFBUUMsTUFBUixJQUFtQixTQUFTQSxNQUFULEdBQWtCO0FBQTVFO0FBQ0QsR0EvRWM7O0FBaUZmOzs7O0FBSUFDLGFBQVcsbUJBQUNDLE1BQUQsRUFBWTtBQUNyQixXQUFPLHlCQUF3QkwsSUFBeEIsQ0FBNkJLLE1BQTdCO0FBQVA7QUFDRDtBQXZGYyxDQUFqQiIsImZpbGUiOiJ1dGlsaXRpZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG52YXIgZmV0Y2ggPSByZXF1aXJlKCdmZXRjaC1wb255ZmlsbCcpKCkuZmV0Y2g7XG52YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9wcml2YXRlL2NvbnN0YW50cy5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lb3V0XG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IFBDMiBTdGF0dXNcbiAgICovXG4gIHBjQ2hlY2s6ICh0aW1lb3V0KSA9PiB7IC8vIHRpbWVvdXQgaXMgaW4gbWlsbGlzZWNvbmRzXG4gICAgdmFyIGFkZHJlc3MgPSBjb25zdGFudHMucGNBZGRyZXNzO1xuICAgIHZhciB0aW1lb3V0VmFsdWUgPSBOdW1iZXIodGltZW91dCAhPSBudWxsID8gdGltZW91dCA6IDApIHx8IDEwMDA7IC8vIGRlZmF1bHQgdGltZW91dCBpcyAxMDAwbXNcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCAhPT0gXCJ1bmRlZmluZWRcIikgeyAvLyBBc3N1bWUgYnJvd3NlcnNpZGU6IGRvbmUgdXNpbmcgeGhyIGJlY2F1c2UgbmV0d29yayBjb25uZWN0aW9ucyBjYW5jZWxsYWJsZVxuICAgICAgICB2YXIgeGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgdmFyIHRpbWVvdXRSZWYgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB4aHR0cC5hYm9ydCgpO1xuICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICB9LCB0aW1lb3V0VmFsdWUpO1xuICAgICAgICB4aHR0cC5vcGVuKFwiR0VUXCIsIGFkZHJlc3MpO1xuICAgICAgICB4aHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgaWYgKHhodHRwLnJlYWR5U3RhdGUgPT09IFhNTEh0dHBSZXF1ZXN0LkRPTkUgJiYgeGh0dHAuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0UmVmKTtcbiAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0UmVmKTtcbiAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgeGh0dHAuc2VuZCgpO1xuICAgICAgfSBlbHNlIHsgLy8gQXNzdW1lIHNlcnZlcnNpZGU6IGRvbmUgdXNpbmcgZmV0Y2ggYXMgcG9ueWZpbGwgYWxyZWFkeSBhdmFpbGFibGUgYW5kIHJlc2lkdWFsIG5ldHdvcmsgY29ubmVjdGlvbnMgaW1tYXRlcmlhbFxuICAgICAgICB2YXIgdGltZW91dFJlZiA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICB9LCB0aW1lb3V0VmFsdWUpO1xuICAgICAgICBmZXRjaChhZGRyZXNzLCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdnZXQnLFxuICAgICAgICAgICAgdGltZW91dDogdGltZW91dFZhbHVlXG4gICAgICAgICAgfSlcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRSZWYpO1xuICAgICAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRSZWYpO1xuICAgICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaChlID0+IHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0UmVmKTtcbiAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc291cmNlTmFtZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gaWRWYWxpZGl0eVxuICAgKi9cbiAgc291cmNlQ2hlY2s6IChzb3VyY2VOYW1lLCBpZCkgPT4ge1xuICAgIHZhciBjaGVja0Z1bmN0aW9uID0gbW9kdWxlLmV4cG9ydHNbc291cmNlTmFtZS50b0xvd2VyQ2FzZSgpICsgXCJDaGVja1wiXTtcbiAgICBpZiAoKHR5cGVvZiBjaGVja0Z1bmN0aW9uID09PSBcImZ1bmN0aW9uXCIpICYmIChzb3VyY2VOYW1lICE9PSBcInNvdXJjZVwiKSkge1xuICAgICAgcmV0dXJuIGNoZWNrRnVuY3Rpb24oaWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3Ioc291cmNlTmFtZSArIFwiIGlzIGFuIGludmFsaWQgc291cmNlXCIpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVuaXByb3RJZFxuICAgKiBAcmV0dXJuIHtib29sZWFufSBpZFZhbGlkaXR5XG4gICAqL1xuICB1bmlwcm90Q2hlY2s6ICh1bmlwcm9kSWQpID0+IHtcbiAgICByZXR1cm4gL14oW0EtTixSLVpdWzAtOV0oW0EtWl1bQS1aLCAwLTldW0EtWiwgMC05XVswLTldKXsxLDJ9KXwoW08sUCxRXVswLTldW0EtWiwgMC05XVtBLVosIDAtOV1bQS1aLCAwLTldWzAtOV0pKFxcLlxcZCspPyQvLnRlc3QodW5pcHJvZElkKTtcbiAgfSxcblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNoZWJpSWRcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gaWRWYWxpZGl0eVxuICAgKi9cbiAgY2hlYmlDaGVjazogKGNoZWJpSWQpID0+IHtcbiAgICByZXR1cm4gL15DSEVCSTpcXGQrJC8udGVzdChjaGViaUlkKSAmJiAoY2hlYmlJZC5sZW5ndGggPD0gKFwiQ0hFQkk6XCIubGVuZ3RoICsgNikpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaGduY0lkXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IGlkVmFsaWRpdHlcbiAgICovXG4gIGhnbmNDaGVjazogKGhnbmNJZCkgPT4ge1xuICAgIHJldHVybiAvXltBLVphLXotMC05X10rKFxcQCk/JC8udGVzdChoZ25jSWQpO1xuICB9XG59XG4iXX0=