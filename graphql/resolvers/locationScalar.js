const { UserInputError } = require('apollo-server-errors');
const { GraphQLScalarType, Kind } = require('graphql');

const locationScalar = new GraphQLScalarType({
    name: 'Location',
    description: 'Location in format of {lat: FLOAT, lng: FLOAT}',
    // process outgoing data returned from server
    serialize(value) {
      // console.log(value);
      try {
        const jsonValue = JSON.parse(value);
        // console.log('returning parsed')
        // console.log(jsonValue);
        return jsonValue;
      } catch {
        // catch block is for locations entered prior to making location an object, so parse will fail
        // console.log('returning unparsed')
        // cosole.log(value)
        return value;
      }
      // convert outgoing data back to object
    },
      // process incoming data from variable
    parseValue(value) {
      if (value === null) {
        throw new UserInputError('User input Error', { catchLocation: 'Please enter a valid catch location' } );
      }
      // convert incoming value to a string
      return JSON.stringify(value);
    },
    // when incoming value is a hard-coded argument rather than a variable argument
    parseLiteral(_) {
        throw new UserInputError('Literal')
    }
  });

  module.exports = locationScalar;