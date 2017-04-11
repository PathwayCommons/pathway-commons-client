'use strict';

var constants = require('./constants.js');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaXZhdGUvaGVscGVycy5qcyJdLCJuYW1lcyI6WyJjb25zdGFudHMiLCJyZXF1aXJlIiwibW9kdWxlIiwiZXhwb3J0cyIsInZhbGlkYXRlU3RyaW5nIiwic3RyaW5nIiwibGVuZ3RoIiwiZXNjYXBlTHVjZW5lIiwiaW5wdXRTdHJpbmciLCJyZXBsYWNlIl0sIm1hcHBpbmdzIjoiQUFBQTs7QUFDQSxJQUFJQSxZQUFZQyxRQUFRLGdCQUFSLENBQWhCOztBQUVBQyxPQUFPQyxPQUFQLEdBQWlCO0FBQ2Y7Ozs7O0FBS0FDLGtCQUFnQix3QkFBQ0MsTUFBRCxFQUFZO0FBQzFCLFFBQUssT0FBT0EsTUFBUCxLQUFrQixRQUFuQixJQUFpQ0EsT0FBT0MsTUFBUCxLQUFrQixDQUF2RCxFQUEyRDtBQUN6RCxhQUFPLElBQVA7QUFDRCxLQUZELE1BRU87QUFDTCxhQUFPLEtBQVA7QUFDRDtBQUNGLEdBWmM7O0FBY2Y7Ozs7O0FBS0FDLGdCQUFjLHNCQUFDQyxXQUFELEVBQWlCO0FBQzdCLFdBQU9BLFlBQVlDLE9BQVosQ0FBb0IsNENBQXBCLEVBQWtFLE1BQWxFLENBQVA7QUFDRDtBQXJCYyxDQUFqQiIsImZpbGUiOiJwcml2YXRlL2hlbHBlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG52YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIC0gU3RyaW5nIHRvIGJlIGNoZWNrZWRcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIGlucHV0IGlzIGEgbm9uLWVtcHR5IHN0cmluZyBlbHNlIHJldHVybnMgZmFsc2VcbiAgICovXG4gIHZhbGlkYXRlU3RyaW5nOiAoc3RyaW5nKSA9PiB7XG4gICAgaWYgKCh0eXBlb2Ygc3RyaW5nID09PSBcInN0cmluZ1wiKSAmJiAoc3RyaW5nLmxlbmd0aCAhPT0gMCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gaW5wdXRTdHJpbmcgLSBTdHJpbmcgdG8gYmUgY2hlY2tlZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IENsZWFuIHN0cmluZ1xuICAgKi9cbiAgZXNjYXBlTHVjZW5lOiAoaW5wdXRTdHJpbmcpID0+IHtcbiAgICByZXR1cm4gaW5wdXRTdHJpbmcucmVwbGFjZSgvKFtcXCFcXCpcXCtcXC1cXCZcXHxcXChcXClcXFtcXF1cXHtcXH1cXF5cXH5cXD9cXDpcXC9cXFxcXCJdKS9nLCBcIlxcXFwkMVwiKTtcbiAgfVxufVxuIl19