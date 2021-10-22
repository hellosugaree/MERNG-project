const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const { UserInputError, ApolloError } = require('apollo-server');
const checkAuth = require('../../utilities/check-auth');
const cloudinary = require('../../utilities/cloudinary');

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
  
  Query: {
    async getUser(_, { userId }) {
      try {
        const privateUserData = await User.findById(userId);
        const { _id, email, catches, username, createdAt, preferences, profilePhoto } = privateUserData;
        const publicUserData = { _id, email, username, catches, preferences, createdAt, profilePhoto };
        console.log(publicUserData);
        return publicUserData;
      } catch (err) {
        throw new Error (err);
      }
    }
  },
  
  Mutation: {

    // validate login
    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password); // same as const errors = validateLoginInput.errors, etc
      
      if (!valid) {
        console.log(errors.body)
        throw new UserInputError('User input error', errors);
      }
      
      const userFound = await User.findOne({ username }); // same as username: username
      
      if (!userFound) {
        errors.username = 'User not found';
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
        registerInput: { username, email, password, confirmPassword }
      }, 
      context, info) {

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
        catches: [],
        createdAt: new Date().toISOString()
      });

      const result = await newUser.save(); // saves new newUser and should assign that reuslting object to result
      
      const token = issueToken(result); // issue web token

      return {
        ...result._doc,
        id: result._id,
        token
      }
    },

    async createOrUpdateProfilePhoto(_, { data }, context) {
      console.log('create or update profile photo');
      const user = checkAuth(context);
      let newProfilePhoto;

      try {
        const userFound = await User.findOne({ username: user.username });
        if (userFound) {
          const upload = new Promise((resolve, reject) => {
            cloudinary.uploader.upload(data, {
              folder: 'profile_photos',
              resource_type: 'image',
              uploadPreset: 'fs_signed_upload'
            }, (error, result) => {
              if (error) {
                reject(error);
              } else {
                const { asset_id, public_id, width, height, format, resource_type, created_at, bytes, url, secure_url } = result; 
                resolve(JSON.stringify({ asset_id, public_id, width, height, format, resource_type, created_at, bytes, url, secure_url }));
              }
            });
          });

          await upload
          .then(result => {
            console.log('resolve');
            console.log(result);
            newProfilePhoto = result;
          })
          .catch(err => {
            console.log('reject');
            console.log(err)
            throw new ApolloError(err);
          });

          userFound.profilePhoto = newProfilePhoto;

          const userUpdated = await User.update(
            { username: user.username }, 
            { profilePhoto: newProfilePhoto }
          );
          console.log(userUpdated);
          return userUpdated;
        
        } else {
          throw new ApolloError('User not found');
        }

      } catch (err) {
        console.log(err);
        throw new ApolloError(err);
      }
    }

  }
};