const { UserInputError } = require('apollo-server-errors');
const { GraphQLScalarType, Kind } = require('graphql');

const cloudinaryImageScalar = new GraphQLScalarType({
    name: 'CloudinaryImage',
    description: 'Cloudinary image Object as returned form cloudinary upload API',
    serialize(value) {
      const jsonValue = JSON.parse(value);
      return jsonValue;
    },
    parseValue(value) {
      return JSON.stringify(value);
    },
    parseLiteral(_) {
    }
  });

  module.exports = cloudinaryImageScalar;