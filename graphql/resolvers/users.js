const User = require('../../models/User'); // import User from User.js
const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const { UserInputError } = require('apollo-server'); // error reporting for adding new users
require('dotenv').config();

const { validateRegisterInput, validateLoginInput } = require('../../utilities/validators'); // import validator function

const issueToken = function(user) {
   // create a login token
  return jsonWebToken.sign(
    // first argument the token details
    {
      id: user.id,
      username: user.username,
      email: user.email,
      
    },
    process.env.TOKEN_KEY, // second argument a secret key stored in .env, can be any made up key and used for encrypting token
    { expiresIn: '1h' } // third argument options (token expiration)
  );
};



module.exports = {
  Mutation: {
    
    // validate login
    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password); // same as const errors = validateLoginInput.errors, etc
      
      if (!valid) {
        throw new UserInputError('User input error', errors);
      }
      
      const userFound = await User.findOne({ username }); // same as username: username
      
      if (!userFound) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', errors);    
      }
    
      const passMatch = await bcrypt.compare(password, userFound.password); // compare password from input to password in database
       if (!passMatch) { // password doesn't match
        errors.password = 'Incorrect password';
        throw new UserInputError('Incorrect password', errors);
       }

       const token = issueToken(userFound); // issue web token

       return {
         ...userFound._doc,
         id: userFound._id,
         token
       }
    },   
    
    
    // register(parent, args, context, info)
    // parent gives input from last step when passing data through mutliple resolvers (not used here)
    // args is arguments from registerInput in typedefs under mutation 
    // info just general metadata not commonly used
    // register function for registering new user

    async register(_, 
      { 
        // destructured
        registerInput: { username, email, password, confirmPassword }
      }, 
      context, info) { // context and info not used in this example

      //validate user data
      // validateRegisterInput returns { valid, errors }, so we destructure it here
      const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
      if (!valid) {
        throw new UserInputError('User input Error', errors);
      }
        
      // Make sure username is unique once we validate all other form data formatting
      const userFound = await User.findOne({ username });
      if (userFound) {
        errors.username = 'This username is already taken';
        throw new UserInputError('User input Error', errors);
      }

      // Hash password and create auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString()
      });

      const result = await newUser.save(); // saves new newUser and should assign that reuslting object to result
      
      const token = issueToken(result); // issue web token

      

      return {
        ...result._doc,
        id: result._id,
        token
      }
    }

  }
};