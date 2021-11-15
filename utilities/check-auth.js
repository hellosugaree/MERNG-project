const jsonWebToken = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server');

module.exports = (context) => {
  const authHeader = context.headers.authorization;
  if (authHeader) { 
    const token = authHeader.split('Bearer ')[1];
    if (token) {
      try {
        const user = jsonWebToken.verify(token, process.env.TOKEN_KEY);
        return user;
      } catch (err) {
        throw new AuthenticationError('Invalid/Expired token');
      }
    } else {
      throw new Error('Invalid authorization header');
    }
  } else {
    throw new Error('Authorization header missing');
  }
}