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
          if (undefined.readyState == 4 && undefined.status == 200) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxpdGllcy5qcyJdLCJuYW1lcyI6WyJmZXRjaCIsInJlcXVpcmUiLCJjb25zdGFudHMiLCJtb2R1bGUiLCJleHBvcnRzIiwicGNDaGVjayIsInRpbWVvdXQiLCJhZGRyZXNzIiwicGNBZGRyZXNzIiwidGltZW91dFZhbHVlIiwiTnVtYmVyIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJYTUxIdHRwUmVxdWVzdCIsInhodHRwIiwidGltZW91dFJlZiIsInNldFRpbWVvdXQiLCJhYm9ydCIsIm9wZW4iLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJyZWFkeVN0YXRlIiwic3RhdHVzIiwiY2xlYXJUaW1lb3V0Iiwic2VuZCIsIm1ldGhvZCIsInRoZW4iLCJyZXNwb25zZSIsImNhdGNoIiwic291cmNlQ2hlY2siLCJzb3VyY2VOYW1lIiwiaWQiLCJjaGVja0Z1bmN0aW9uIiwidG9Mb3dlckNhc2UiLCJTeW50YXhFcnJvciIsInVuaXByb3RDaGVjayIsInVuaXByb2RJZCIsInRlc3QiLCJjaGViaUNoZWNrIiwiY2hlYmlJZCIsImxlbmd0aCIsImhnbmNDaGVjayIsImhnbmNJZCJdLCJtYXBwaW5ncyI6IkFBQUE7O0FBQ0EsSUFBSUEsUUFBUUMsUUFBUSxnQkFBUixJQUE0QkQsS0FBeEM7QUFDQSxJQUFJRSxZQUFZRCxRQUFRLHdCQUFSLENBQWhCOztBQUVBRSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2Y7Ozs7QUFJQUMsV0FBUyxpQkFBQ0MsT0FBRCxFQUFhO0FBQUU7QUFDdEIsUUFBSUMsVUFBVUwsVUFBVU0sU0FBeEI7QUFDQSxRQUFJQyxlQUFlQyxPQUFPSixXQUFXLElBQVgsR0FBa0JBLE9BQWxCLEdBQTRCLENBQW5DLEtBQXlDLElBQTVELENBRm9CLENBRThDO0FBQ2xFLFdBQU8sSUFBSUssT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUN0QyxVQUFJLE9BQU9DLGNBQVAsS0FBMEIsV0FBOUIsRUFBMkM7QUFBRTtBQUMzQyxZQUFJQyxRQUFRLElBQUlELGNBQUosRUFBWjtBQUNBLFlBQUlFLGFBQWFDLFdBQVcsWUFBTTtBQUNoQ0YsZ0JBQU1HLEtBQU47QUFDQU4sa0JBQVEsS0FBUjtBQUNELFNBSGdCLEVBR2RILFlBSGMsQ0FBakI7QUFJQU0sY0FBTUksSUFBTixDQUFXLEtBQVgsRUFBa0JaLE9BQWxCO0FBQ0FRLGNBQU1LLGtCQUFOLEdBQTJCLFlBQU07QUFDL0IsY0FBSSxVQUFLQyxVQUFMLElBQW1CLENBQW5CLElBQXdCLFVBQUtDLE1BQUwsSUFBZSxHQUEzQyxFQUFnRDtBQUM5Q0MseUJBQWFQLFVBQWI7QUFDQUosb0JBQVEsSUFBUjtBQUNELFdBSEQsTUFHTztBQUNMVyx5QkFBYVAsVUFBYjtBQUNBSixvQkFBUSxLQUFSO0FBQ0Q7QUFDRixTQVJEO0FBU0FHLGNBQU1TLElBQU47QUFDRCxPQWpCRCxNQWlCTztBQUFFO0FBQ1AsWUFBSVIsYUFBYUMsV0FBVyxZQUFNO0FBQ2hDTCxrQkFBUSxLQUFSO0FBQ0QsU0FGZ0IsRUFFZEgsWUFGYyxDQUFqQjtBQUdBVCxjQUFNTyxPQUFOLEVBQWU7QUFDWGtCLGtCQUFRLEtBREc7QUFFWG5CLG1CQUFTRztBQUZFLFNBQWYsRUFJR2lCLElBSkgsQ0FJUSxvQkFBWTtBQUNoQixjQUFJQyxTQUFTTCxNQUFULEtBQW9CLEdBQXhCLEVBQTZCO0FBQzNCQyx5QkFBYVAsVUFBYjtBQUNBSixvQkFBUSxJQUFSO0FBQ0QsV0FIRCxNQUdPO0FBQ0xXLHlCQUFhUCxVQUFiO0FBQ0FKLG9CQUFRLEtBQVI7QUFDRDtBQUNGLFNBWkgsRUFhR2dCLEtBYkgsQ0FhUyxhQUFLO0FBQ1ZMLHVCQUFhUCxVQUFiO0FBQ0FKLGtCQUFRLEtBQVI7QUFDRCxTQWhCSDtBQWlCRDtBQUNGLEtBeENNLENBQVA7QUF5Q0QsR0FqRGM7O0FBbURmOzs7OztBQUtBaUIsZUFBYSxxQkFBQ0MsVUFBRCxFQUFhQyxFQUFiLEVBQW9CO0FBQy9CLFFBQUlDLGdCQUFnQjdCLE9BQU9DLE9BQVAsQ0FBZTBCLFdBQVdHLFdBQVgsS0FBMkIsT0FBMUMsQ0FBcEI7QUFDQSxRQUFLLE9BQU9ELGFBQVAsS0FBeUIsVUFBMUIsSUFBMENGLGVBQWUsUUFBN0QsRUFBd0U7QUFDdEUsYUFBT0UsY0FBY0QsRUFBZCxDQUFQO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsWUFBTSxJQUFJRyxXQUFKLENBQWdCSixhQUFhLHVCQUE3QixDQUFOO0FBQ0Q7QUFDRixHQS9EYzs7QUFpRWY7Ozs7QUFJQUssZ0JBQWMsc0JBQUNDLFNBQUQsRUFBZTtBQUMzQixXQUFPLHFIQUFvSEMsSUFBcEgsQ0FBeUhELFNBQXpIO0FBQVA7QUFDRCxHQXZFYzs7QUF5RWY7Ozs7QUFJQUUsY0FBWSxvQkFBQ0MsT0FBRCxFQUFhO0FBQ3ZCLFdBQU8sZUFBY0YsSUFBZCxDQUFtQkUsT0FBbkIsS0FBZ0NBLFFBQVFDLE1BQVIsSUFBbUIsU0FBU0EsTUFBVCxHQUFrQjtBQUE1RTtBQUNELEdBL0VjOztBQWlGZjs7OztBQUlBQyxhQUFXLG1CQUFDQyxNQUFELEVBQVk7QUFDckIsV0FBTyx5QkFBd0JMLElBQXhCLENBQTZCSyxNQUE3QjtBQUFQO0FBQ0Q7QUF2RmMsQ0FBakIiLCJmaWxlIjoidXRpbGl0aWVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xudmFyIGZldGNoID0gcmVxdWlyZSgnZmV0Y2gtcG9ueWZpbGwnKSgpLmZldGNoO1xudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoJy4vcHJpdmF0ZS9jb25zdGFudHMuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge251bWJlcn0gdGltZW91dFxuICAgKiBAcmV0dXJuIHtib29sZWFufSBQQzIgU3RhdHVzXG4gICAqL1xuICBwY0NoZWNrOiAodGltZW91dCkgPT4geyAvLyB0aW1lb3V0IGlzIGluIG1pbGxpc2Vjb25kc1xuICAgIHZhciBhZGRyZXNzID0gY29uc3RhbnRzLnBjQWRkcmVzcztcbiAgICB2YXIgdGltZW91dFZhbHVlID0gTnVtYmVyKHRpbWVvdXQgIT0gbnVsbCA/IHRpbWVvdXQgOiAwKSB8fCAxMDAwOyAvLyBkZWZhdWx0IHRpbWVvdXQgaXMgMTAwMG1zXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT09IFwidW5kZWZpbmVkXCIpIHsgLy8gQXNzdW1lIGJyb3dzZXJzaWRlOiBkb25lIHVzaW5nIHhociBiZWNhdXNlIG5ldHdvcmsgY29ubmVjdGlvbnMgY2FuY2VsbGFibGVcbiAgICAgICAgdmFyIHhodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHZhciB0aW1lb3V0UmVmID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgeGh0dHAuYWJvcnQoKTtcbiAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgfSwgdGltZW91dFZhbHVlKTtcbiAgICAgICAgeGh0dHAub3BlbihcIkdFVFwiLCBhZGRyZXNzKTtcbiAgICAgICAgeGh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT0gNCAmJiB0aGlzLnN0YXR1cyA9PSAyMDApIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0UmVmKTtcbiAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0UmVmKTtcbiAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgeGh0dHAuc2VuZCgpO1xuICAgICAgfSBlbHNlIHsgLy8gQXNzdW1lIHNlcnZlcnNpZGU6IGRvbmUgdXNpbmcgZmV0Y2ggYXMgcG9ueWZpbGwgYWxyZWFkeSBhdmFpbGFibGUgYW5kIHJlc2lkdWFsIG5ldHdvcmsgY29ubmVjdGlvbnMgaW1tYXRlcmlhbFxuICAgICAgICB2YXIgdGltZW91dFJlZiA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICB9LCB0aW1lb3V0VmFsdWUpO1xuICAgICAgICBmZXRjaChhZGRyZXNzLCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdnZXQnLFxuICAgICAgICAgICAgdGltZW91dDogdGltZW91dFZhbHVlXG4gICAgICAgICAgfSlcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRSZWYpO1xuICAgICAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRSZWYpO1xuICAgICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaChlID0+IHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0UmVmKTtcbiAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc291cmNlTmFtZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gaWRWYWxpZGl0eVxuICAgKi9cbiAgc291cmNlQ2hlY2s6IChzb3VyY2VOYW1lLCBpZCkgPT4ge1xuICAgIHZhciBjaGVja0Z1bmN0aW9uID0gbW9kdWxlLmV4cG9ydHNbc291cmNlTmFtZS50b0xvd2VyQ2FzZSgpICsgXCJDaGVja1wiXTtcbiAgICBpZiAoKHR5cGVvZiBjaGVja0Z1bmN0aW9uID09PSBcImZ1bmN0aW9uXCIpICYmIChzb3VyY2VOYW1lICE9PSBcInNvdXJjZVwiKSkge1xuICAgICAgcmV0dXJuIGNoZWNrRnVuY3Rpb24oaWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3Ioc291cmNlTmFtZSArIFwiIGlzIGFuIGludmFsaWQgc291cmNlXCIpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVuaXByb3RJZFxuICAgKiBAcmV0dXJuIHtib29sZWFufSBpZFZhbGlkaXR5XG4gICAqL1xuICB1bmlwcm90Q2hlY2s6ICh1bmlwcm9kSWQpID0+IHtcbiAgICByZXR1cm4gL14oW0EtTixSLVpdWzAtOV0oW0EtWl1bQS1aLCAwLTldW0EtWiwgMC05XVswLTldKXsxLDJ9KXwoW08sUCxRXVswLTldW0EtWiwgMC05XVtBLVosIDAtOV1bQS1aLCAwLTldWzAtOV0pKFxcLlxcZCspPyQvLnRlc3QodW5pcHJvZElkKTtcbiAgfSxcblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNoZWJpSWRcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gaWRWYWxpZGl0eVxuICAgKi9cbiAgY2hlYmlDaGVjazogKGNoZWJpSWQpID0+IHtcbiAgICByZXR1cm4gL15DSEVCSTpcXGQrJC8udGVzdChjaGViaUlkKSAmJiAoY2hlYmlJZC5sZW5ndGggPD0gKFwiQ0hFQkk6XCIubGVuZ3RoICsgNikpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaGduY0lkXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IGlkVmFsaWRpdHlcbiAgICovXG4gIGhnbmNDaGVjazogKGhnbmNJZCkgPT4ge1xuICAgIHJldHVybiAvXltBLVphLXotMC05X10rKFxcQCk/JC8udGVzdChoZ25jSWQpO1xuICB9XG59XG4iXX0=