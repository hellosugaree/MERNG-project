const { UserInputError } = require('apollo-server-errors');
const { GraphQLScalarType, Kind } = require('graphql');

const cloudinaryImageScalar = new GraphQLScalarType({
    name: 'CloudinaryImage',
    description: 'Cloudinary image Object as returned form cloudinary upload API',
    // process outgoing data
    serialize(value) {
      console.log('serialize');
      console.log(value);
      const jsonValue = JSON.parse(value);
      return jsonValue;
    },
    parseValue(value) {
      // convert incoming value to a string
      console.log('parse')
      console.log(value)
      return JSON.stringify(value);
    },
    // when incoming value is a hard-coded argument rather than a variable argument
    parseLiteral(_) {
      console.log('literal')
        // throw new UserInputError('Literal')
    }
  });

  module.exports = cloudinaryImageScalar;