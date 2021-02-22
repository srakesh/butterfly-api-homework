'use strict';

const { validateButterfly, validateUser, validateButterflyRatingInput } = require('../src/validators');

describe('validateButterfly', () => {
  const validButterfly = {
    commonName: 'Butterfly Name',
    species: 'Species name',
    article: 'http://example.com/article'
  };

  it('is ok for a valid butterfly', () => {
    const result = validateButterfly(validButterfly);
    expect(result).toBe(undefined);
  });

  it('throws an error when invalid', () => {
    expect(() => {
      validateButterfly({});
    }).toThrow('The following properties have invalid values:');

    expect(() => {
      validateButterfly({
        ...validButterfly,
        commonName: 123
      });
    }).toThrow('commonName must be a string.');

    expect(() => {
      validateButterfly({
        extra: 'field',
        ...validButterfly
      });
    }).toThrow('The following keys are invalid: extra');
  });
});

describe('validateUser', () => {
  const validUser = {
    username: 'test-user'
  };

  it('is ok for a valid user', () => {
    const result = validateUser(validUser);
    expect(result).toBe(undefined);
  });

  it('throws an error when invalid', () => {
    expect(() => {
      validateUser({});
    }).toThrow('username is required');

    expect(() => {
      validateUser({
        extra: 'field',
        ...validUser
      });
    }).toThrow('The following keys are invalid: extra');

    expect(() => {
      validateUser({
        username: [555]
      });
    }).toThrow('username must be a string');
  });
});


describe('validateButterflyRatingInput', () => {
  const validButterflyRating = {
    userid: 'aqekk3t4kw',
    butterflyid: 'GI9_EuH8s1',
    rating: 4.2
  };

  it('is ok for a valid butterfly rating', () => {
    const result = validateButterflyRatingInput(validButterflyRating);
    expect(result).toBe(undefined);
  });

  it('throws an error when invalid', () => {
    expect(() => {
      validateButterflyRatingInput({});
    }).toThrow('The following properties have invalid values:');

    expect(() => {
      validateButterflyRatingInput({
        ...validButterflyRating,
        rating: '5.5'
      });
    }).toThrow('rating must be a number between 0 & 5 (inclusive)');

    expect(() => {
      validateButterflyRatingInput({
        extra: 'field',
        ...validButterflyRating
      });
    }).toThrow('The following keys are invalid: extra');
  });
});
