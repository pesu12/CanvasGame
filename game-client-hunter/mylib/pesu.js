/**
 * Helpers and tools to ease your JavaScript day.
 *
 * @author Per Sundberg (sundberg_p@yahoo.com)
 */
window.Pesu = (function(window, document, undefined ) {
  var Pesu = {};

  /**
   * Generate a random number.
   * @param min the smallest possible number
   * @param max the largest possible number
   * @returns a random number where min >= number <= max
   */
  Pesu.random = function (min, max) {
    return Math.floor(Math.random()*(max+1-min)+min);
  };

  // Expose public methods
  return Pesu;

})(window, window.document);
