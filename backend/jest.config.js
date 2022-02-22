const jestMongoPreset = require('@shelf/jest-mongodb/jest-preset')
const tsJestPreset = require('ts-jest/jest-preset')

module.exports = {
  ...jestMongoPreset,
  ...tsJestPreset
};