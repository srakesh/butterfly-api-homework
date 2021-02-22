'use strict';

const v = require('@mapbox/fusspot');

const validateButterfly = v.assert(
  v.strictShape({
    commonName: v.required(v.string),
    species: v.required(v.string),
    article: v.required(v.string)
  })
);

const validateUser = v.assert(
  v.strictShape({
    username: v.required(v.string)
  })
);

/**
 * Validates if a) userid is string
 * 		b) butterflyid is string
 * 		c) rating is a number between 0 and 5
 */
const validateButterflyRatingInput = v.assert(
  v.strictShape({
    userid: v.required(v.string),
    butterflyid: v.required(v.string),
    rating: v.required(v.range([0, 5]))
  })
);

module.exports = {
  validateButterfly,
  validateUser,
  validateButterflyRatingInput
};
