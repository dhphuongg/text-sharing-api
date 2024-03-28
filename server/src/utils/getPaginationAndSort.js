const { constants } = require('../constants');
const pick = require('./pick');

function getOptions(query) {
  let { limit, page, sortBy, keyword } = pick(query, ['limit', 'page', 'sortBy', 'keyword']);

  if (!limit) limit = constants.limitDefault;
  else limit = parseInt(limit);
  if (!page) page = constants.pageDefault;
  else page = parseInt(page);
  if (!sortBy) sortBy = constants.sortByDefault;

  return { limit, page, sortBy, keyword };
}

module.exports = { getOptions };
