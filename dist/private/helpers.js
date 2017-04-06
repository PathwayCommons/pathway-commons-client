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
   * @param {string} string - String to be checked
   * @return {boolean} Returns true if string exists in pc2Formats array else returns false
   */
  validateWithConstArray: function validateWithConstArray(constArrayName, string) {
    if (typeof string === "string" && constants[constArrayName].indexOf(string) !== -1) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaXZhdGUvaGVscGVycy5qcyJdLCJuYW1lcyI6WyJjb25zdGFudHMiLCJyZXF1aXJlIiwibW9kdWxlIiwiZXhwb3J0cyIsInZhbGlkYXRlU3RyaW5nIiwic3RyaW5nIiwibGVuZ3RoIiwidmFsaWRhdGVXaXRoQ29uc3RBcnJheSIsImNvbnN0QXJyYXlOYW1lIiwiaW5kZXhPZiIsImVzY2FwZUx1Y2VuZSIsImlucHV0U3RyaW5nIiwicmVwbGFjZSJdLCJtYXBwaW5ncyI6IkFBQUE7O0FBQ0EsSUFBSUEsWUFBWUMsUUFBUSxnQkFBUixDQUFoQjs7QUFFQUMsT0FBT0MsT0FBUCxHQUFpQjtBQUNmOzs7OztBQUtBQyxrQkFBZ0Isd0JBQUNDLE1BQUQsRUFBWTtBQUMxQixRQUFLLE9BQU9BLE1BQVAsS0FBa0IsUUFBbkIsSUFBaUNBLE9BQU9DLE1BQVAsS0FBa0IsQ0FBdkQsRUFBMkQ7QUFDekQsYUFBTyxJQUFQO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsYUFBTyxLQUFQO0FBQ0Q7QUFDRixHQVpjOztBQWNmOzs7OztBQUtBQywwQkFBd0IsZ0NBQUNDLGNBQUQsRUFBaUJILE1BQWpCLEVBQTRCO0FBQ2xELFFBQUssT0FBT0EsTUFBUCxLQUFrQixRQUFuQixJQUFpQ0wsVUFBVVEsY0FBVixFQUEwQkMsT0FBMUIsQ0FBa0NKLE1BQWxDLE1BQThDLENBQUMsQ0FBcEYsRUFBd0Y7QUFDdEYsYUFBTyxJQUFQO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsYUFBTyxLQUFQO0FBQ0Q7QUFDRixHQXpCYzs7QUEyQmY7Ozs7O0FBS0FLLGdCQUFjLHNCQUFDQyxXQUFELEVBQWlCO0FBQzdCLFdBQU9BLFlBQVlDLE9BQVosQ0FBb0IsNENBQXBCLEVBQWtFLE1BQWxFLENBQVA7QUFDRDtBQWxDYyxDQUFqQiIsImZpbGUiOiJwcml2YXRlL2hlbHBlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG52YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIC0gU3RyaW5nIHRvIGJlIGNoZWNrZWRcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIGlucHV0IGlzIGEgbm9uLWVtcHR5IHN0cmluZyBlbHNlIHJldHVybnMgZmFsc2VcbiAgICovXG4gIHZhbGlkYXRlU3RyaW5nOiAoc3RyaW5nKSA9PiB7XG4gICAgaWYgKCh0eXBlb2Ygc3RyaW5nID09PSBcInN0cmluZ1wiKSAmJiAoc3RyaW5nLmxlbmd0aCAhPT0gMCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIC0gU3RyaW5nIHRvIGJlIGNoZWNrZWRcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIHN0cmluZyBleGlzdHMgaW4gcGMyRm9ybWF0cyBhcnJheSBlbHNlIHJldHVybnMgZmFsc2VcbiAgICovXG4gIHZhbGlkYXRlV2l0aENvbnN0QXJyYXk6IChjb25zdEFycmF5TmFtZSwgc3RyaW5nKSA9PiB7XG4gICAgaWYgKCh0eXBlb2Ygc3RyaW5nID09PSBcInN0cmluZ1wiKSAmJiAoY29uc3RhbnRzW2NvbnN0QXJyYXlOYW1lXS5pbmRleE9mKHN0cmluZykgIT09IC0xKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpbnB1dFN0cmluZyAtIFN0cmluZyB0byBiZSBjaGVja2VkXG4gICAqIEByZXR1cm4ge3N0cmluZ30gQ2xlYW4gc3RyaW5nXG4gICAqL1xuICBlc2NhcGVMdWNlbmU6IChpbnB1dFN0cmluZykgPT4ge1xuICAgIHJldHVybiBpbnB1dFN0cmluZy5yZXBsYWNlKC8oW1xcIVxcKlxcK1xcLVxcJlxcfFxcKFxcKVxcW1xcXVxce1xcfVxcXlxcflxcP1xcOlxcL1xcXFxcIl0pL2csIFwiXFxcXCQxXCIpO1xuICB9XG59XG4iXX0=