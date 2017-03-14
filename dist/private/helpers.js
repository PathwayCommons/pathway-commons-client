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
   * @private
   * @param {string} uniprotId
   * @return {boolean} idValidity
   */
  uniprotCheck: function uniprotCheck(uniprodId) {
    return (/^([A-N,R-Z][0-9]([A-Z][A-Z, 0-9][A-Z, 0-9][0-9]){1,2})|([O,P,Q][0-9][A-Z, 0-9][A-Z, 0-9][A-Z, 0-9][0-9])(\.\d+)?$/.test(uniprodId)
    );
  },

  /**
   * @private
   * @param {string} chebiId
   * @return {boolean} idValidity
   */
  chebiCheck: function chebiCheck(chebiId) {
    return (/^CHEBI:\d+$/.test(chebiId) && chebiId.length <= "CHEBI:".length + 6
    );
  },

  /**
   * @private
   * @param {string} hgncId
   * @return {boolean} idValidity
   */
  hgncCheck: function hgncCheck(hgncId) {
    return (/^[A-Za-z-0-9_]+(\@)?$/.test(hgncId)
    );
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaXZhdGUvaGVscGVycy5qcyJdLCJuYW1lcyI6WyJjb25zdGFudHMiLCJyZXF1aXJlIiwibW9kdWxlIiwiZXhwb3J0cyIsInZhbGlkYXRlU3RyaW5nIiwic3RyaW5nIiwibGVuZ3RoIiwidmFsaWRhdGVXaXRoQ29uc3RBcnJheSIsImNvbnN0QXJyYXlOYW1lIiwiaW5kZXhPZiIsInNvdXJjZUNoZWNrIiwic291cmNlTmFtZSIsImlkIiwiY2hlY2tGdW5jdGlvbiIsInRvTG93ZXJDYXNlIiwiU3ludGF4RXJyb3IiLCJ1bmlwcm90Q2hlY2siLCJ1bmlwcm9kSWQiLCJ0ZXN0IiwiY2hlYmlDaGVjayIsImNoZWJpSWQiLCJoZ25jQ2hlY2siLCJoZ25jSWQiXSwibWFwcGluZ3MiOiJBQUFBOztBQUNBLElBQUlBLFlBQVlDLFFBQVEsZ0JBQVIsQ0FBaEI7O0FBRUFDLE9BQU9DLE9BQVAsR0FBaUI7QUFDZjs7Ozs7QUFLQUMsa0JBQWdCLHdCQUFDQyxNQUFELEVBQVk7QUFDMUIsUUFBSyxPQUFPQSxNQUFQLEtBQWtCLFFBQW5CLElBQWlDQSxPQUFPQyxNQUFQLEtBQWtCLENBQXZELEVBQTJEO0FBQ3pELGFBQU8sSUFBUDtBQUNELEtBRkQsTUFFTztBQUNMLGFBQU8sS0FBUDtBQUNEO0FBQ0YsR0FaYzs7QUFjZjs7Ozs7QUFLQUMsMEJBQXdCLGdDQUFDQyxjQUFELEVBQWlCSCxNQUFqQixFQUE0QjtBQUNsRCxRQUFLLE9BQU9BLE1BQVAsS0FBa0IsUUFBbkIsSUFBaUNMLFVBQVVRLGNBQVYsRUFBMEJDLE9BQTFCLENBQWtDSixNQUFsQyxNQUE4QyxDQUFDLENBQXBGLEVBQXdGO0FBQ3RGLGFBQU8sSUFBUDtBQUNELEtBRkQsTUFFTztBQUNMLGFBQU8sS0FBUDtBQUNEO0FBQ0YsR0F6QmM7O0FBMkJmOzs7Ozs7QUFNQUssZUFBYSxxQkFBQ0MsVUFBRCxFQUFhQyxFQUFiLEVBQW9CO0FBQy9CLFFBQUlDLGdCQUFnQlgsT0FBT0MsT0FBUCxDQUFlUSxXQUFXRyxXQUFYLEtBQTJCLE9BQTFDLENBQXBCO0FBQ0EsUUFBSyxPQUFPRCxhQUFQLEtBQXlCLFVBQTFCLElBQTBDRixlQUFlLFFBQTdELEVBQXdFO0FBQ3RFLGFBQU9FLGNBQWNELEVBQWQsQ0FBUDtBQUNELEtBRkQsTUFFTztBQUNMLFlBQU0sSUFBSUcsV0FBSixDQUFnQkosYUFBYSx1QkFBN0IsQ0FBTjtBQUNEO0FBQ0YsR0F4Q2M7O0FBMENmOzs7OztBQUtBSyxnQkFBYyxzQkFBQ0MsU0FBRCxFQUFlO0FBQzNCLFdBQU8scUhBQW9IQyxJQUFwSCxDQUF5SEQsU0FBekg7QUFBUDtBQUNELEdBakRjOztBQW1EZjs7Ozs7QUFLQUUsY0FBWSxvQkFBQ0MsT0FBRCxFQUFhO0FBQ3ZCLFdBQU8sZUFBY0YsSUFBZCxDQUFtQkUsT0FBbkIsS0FBZ0NBLFFBQVFkLE1BQVIsSUFBbUIsU0FBU0EsTUFBVCxHQUFrQjtBQUE1RTtBQUNELEdBMURjOztBQTREZjs7Ozs7QUFLQWUsYUFBVyxtQkFBQ0MsTUFBRCxFQUFZO0FBQ3JCLFdBQU8seUJBQXdCSixJQUF4QixDQUE2QkksTUFBN0I7QUFBUDtBQUNEO0FBbkVjLENBQWpCIiwiZmlsZSI6InByaXZhdGUvaGVscGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcbnZhciBjb25zdGFudHMgPSByZXF1aXJlKCcuL2NvbnN0YW50cy5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgLSBTdHJpbmcgdG8gYmUgY2hlY2tlZFxuICAgKiBAcmV0dXJuIHtib29sZWFufSBSZXR1cm5zIHRydWUgaWYgaW5wdXQgaXMgYSBub24tZW1wdHkgc3RyaW5nIGVsc2UgcmV0dXJucyBmYWxzZVxuICAgKi9cbiAgdmFsaWRhdGVTdHJpbmc6IChzdHJpbmcpID0+IHtcbiAgICBpZiAoKHR5cGVvZiBzdHJpbmcgPT09IFwic3RyaW5nXCIpICYmIChzdHJpbmcubGVuZ3RoICE9PSAwKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgLSBTdHJpbmcgdG8gYmUgY2hlY2tlZFxuICAgKiBAcmV0dXJuIHtib29sZWFufSBSZXR1cm5zIHRydWUgaWYgc3RyaW5nIGV4aXN0cyBpbiBwYzJGb3JtYXRzIGFycmF5IGVsc2UgcmV0dXJucyBmYWxzZVxuICAgKi9cbiAgdmFsaWRhdGVXaXRoQ29uc3RBcnJheTogKGNvbnN0QXJyYXlOYW1lLCBzdHJpbmcpID0+IHtcbiAgICBpZiAoKHR5cGVvZiBzdHJpbmcgPT09IFwic3RyaW5nXCIpICYmIChjb25zdGFudHNbY29uc3RBcnJheU5hbWVdLmluZGV4T2Yoc3RyaW5nKSAhPT0gLTEpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNvdXJjZU5hbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IGlkVmFsaWRpdHlcbiAgICovXG4gIHNvdXJjZUNoZWNrOiAoc291cmNlTmFtZSwgaWQpID0+IHtcbiAgICB2YXIgY2hlY2tGdW5jdGlvbiA9IG1vZHVsZS5leHBvcnRzW3NvdXJjZU5hbWUudG9Mb3dlckNhc2UoKSArIFwiQ2hlY2tcIl07XG4gICAgaWYgKCh0eXBlb2YgY2hlY2tGdW5jdGlvbiA9PT0gXCJmdW5jdGlvblwiKSAmJiAoc291cmNlTmFtZSAhPT0gXCJzb3VyY2VcIikpIHtcbiAgICAgIHJldHVybiBjaGVja0Z1bmN0aW9uKGlkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKHNvdXJjZU5hbWUgKyBcIiBpcyBhbiBpbnZhbGlkIHNvdXJjZVwiKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1bmlwcm90SWRcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gaWRWYWxpZGl0eVxuICAgKi9cbiAgdW5pcHJvdENoZWNrOiAodW5pcHJvZElkKSA9PiB7XG4gICAgcmV0dXJuIC9eKFtBLU4sUi1aXVswLTldKFtBLVpdW0EtWiwgMC05XVtBLVosIDAtOV1bMC05XSl7MSwyfSl8KFtPLFAsUV1bMC05XVtBLVosIDAtOV1bQS1aLCAwLTldW0EtWiwgMC05XVswLTldKShcXC5cXGQrKT8kLy50ZXN0KHVuaXByb2RJZCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjaGViaUlkXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IGlkVmFsaWRpdHlcbiAgICovXG4gIGNoZWJpQ2hlY2s6IChjaGViaUlkKSA9PiB7XG4gICAgcmV0dXJuIC9eQ0hFQkk6XFxkKyQvLnRlc3QoY2hlYmlJZCkgJiYgKGNoZWJpSWQubGVuZ3RoIDw9IChcIkNIRUJJOlwiLmxlbmd0aCArIDYpKTtcbiAgfSxcblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGhnbmNJZFxuICAgKiBAcmV0dXJuIHtib29sZWFufSBpZFZhbGlkaXR5XG4gICAqL1xuICBoZ25jQ2hlY2s6IChoZ25jSWQpID0+IHtcbiAgICByZXR1cm4gL15bQS1aYS16LTAtOV9dKyhcXEApPyQvLnRlc3QoaGduY0lkKTtcbiAgfVxufVxuIl19