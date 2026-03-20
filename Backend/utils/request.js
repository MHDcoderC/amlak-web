const mongoose = require('mongoose');

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * Build safe pagination values from query parameters.
 */
const getPagination = (query) => {
  const page = Number.parseInt(query.page, 10) || DEFAULT_PAGE;
  const rawLimit = Number.parseInt(query.limit, 10) || DEFAULT_LIMIT;
  const limit = Math.min(Math.max(rawLimit, 1), MAX_LIMIT);
  const skip = (Math.max(page, 1) - 1) * limit;

  return { page: Math.max(page, 1), limit, skip };
};

/**
 * Validate MongoDB ObjectId format before querying.
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

module.exports = {
  getPagination,
  isValidObjectId
};
