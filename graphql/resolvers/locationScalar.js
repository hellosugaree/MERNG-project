const { UserInputError } = require('apollo-server-errors');
const { GraphQLScalarType, Kind } = require('graphql');

const locationScalar = new GraphQLScalarType({
    name: 'Location',
    description: 'Location in format of {lat: FLOAT, lng: FLOAT}',
    // process outgoing data
    serialize(value) {
      console.log('serialize')
      // console.log(JSON.parse(value));
      try {
        const jsonValue = JSON.parse(value);
        console.log(jsonValue);
        return jsonValue;
      } catch {
        return value;
      }
      // convert outgoing data back to object
    },
      // process incoming data from variable
    parseValue(value) {
      console.log('parse')
      // return new UserInputError('test')
      // return value
      // throw new UserInputError('Input error');
      if (value === null) {
        throw new UserInputError('User input Error', { catchLocation: 'Please enter a valid catch location' } );
      }
      // convert incoming value to a string
      return JSON.stringify(value);
    },
    // when incoming value is a hard-coded argument rather than a variable argument
    parseLiteral(ast) {
      console.log('literal')

      // console.log(ast.fields)
      // console.log(Object.keys(ast));
      // console.log(Object.keys(ast.fields))
      //   // console.log(JSON.stringify(ast));
        throw new UserInputError('Literal')
        return null;
    }
  });

  module.exports = locationScalar;