const jsonWebToken = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server'); // Authentication error handling

// export a function 
module.exports = (context) => {
  // context has object { headers, ... }
  // console.log(context.headers);
  const authHeader = context.headers.authorization;
  console.log(context.headers);
  if (authHeader) { // check to make sure auth header was sent with context
    // Auth header has format of string with 'Bearer (token here)'
    const token = authHeader.split('Bearer ')[1]; // get just the token part from the auth header
    if (token) { // make sure token actually exists in auth header
      try {
        const user = jsonWebToken.verify(token, process.env.TOKEN_KEY);
        return user;
      } catch (err) {
        throw new AuthenticationError('Invalid/Expired token');
      }
    } else { // no token
      throw new Error('Authentication token must be \'Bearer [token]');
    }
  } else { // no auth header 
    throw new Error('Authorization header missing');
  }
}