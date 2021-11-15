const { UserInputError } = require('apollo-server-errors');
const { GraphQLScalarType } = require('graphql');

const locationScalar = new GraphQLScalarType({
    name: 'Location',
    description: 'Location in format of {lat: FLOAT, lng: FLOAT}',
    serialize(value) {
      try {
        const jsonValue = JSON.parse(value);
        return jsonValue;
      } catch {
        return value;
      }
    },
    parseValue(value) {
      if (value === null) {
        throw new UserInputError('User input Error', { catchLocation: 'Please enter a valid catch location' } );
      }
      return JSON.stringify(value);
    },
    parseLiteral(_) {
        throw new UserInputError('Literal')
    }
  });

  module.exports = locationScalar;