/**
 * Replaces all consecutive whitespace characters in a string with '<->'.
 *
 * @param {string} input - The input string to process.
 * @returns {string} - The resulting string with consecutive whitespace replaced by '<->'.
 *
 * @example
 * const result = replaceWhitespaceWithArrow("This is   a test.");
 * console.log(result); // "This<->is<->a<->test."
 */
function replaceWhitespaceWithArrow(input = '') {
  return input.replace(/\s+/g, '<->');
}

module.exports = { replaceWhitespaceWithArrow };
