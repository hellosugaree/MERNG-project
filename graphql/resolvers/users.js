const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const { UserInputError, ApolloError } = require('apollo-server');
const checkAuth = require('../../utilities/check-auth');
const cloudinary = require('../../utilities/cloudinary');
require('dotenv').config();

const { validateRegisterInput, validateLoginInput } = require('../../utilities/validators');

const issueToken = function(user) {
  return jsonWebToken.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      
    },
    process.env.TOKEN_KEY,
    { expiresIn: '1h' }
  );
};

module.exports = {
  Query: {
    async getUser(_, { userId }) {
      try {
        const privateUserData = await User.findById(userId);
        const { _id, email, catches, username, createdAt, preferences, profilePhoto } = privateUserData;
        const publicUserData = { _id, email, username, catches, preferences, createdAt, profilePhoto };
        if (!profilePhoto) {
          publicUserData.profilePhoto = '{"secure_url": "/img/icons/small/Rockfish-Small.png"}';
        }
        return publicUserData;
      } catch (err) {
        throw new Error (err);
      }
    }
  },
  
  Mutation: {
    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);
      
      if (!valid) {
        throw new UserInputError('User input error', errors);
      }
      
      const userFound = await User.findOne({ username });
      
      if (!userFound) {
        errors.username = 'User not found';
        throw new UserInputError('User not found', errors);    
      }
    
      const passMatch = await bcrypt.compare(password, userFound.password);
       if (!passMatch) {
        errors.password = 'Incorrect password';
        throw new UserInputError('Incorrect password', errors);
       }

       const token = issueToken(userFound);

       return {
         ...userFound._doc,
         id: userFound._id,
         token
       }
    },

    async register(_, 
      { 
        registerInput: { username, email, password, confirmPassword }
      }, 
      context, info) {
      const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
      if (!valid) {
        throw new UserInputError('User input Error', errors);
      }
        
      const userFound = await User.findOne({ username });

      if (userFound) {
        errors.username = 'This username is already taken';
        throw new UserInputError('User input Error', errors);
      }

      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        catches: [],
        createdAt: new Date().toISOString()
      });

      const result = await newUser.save();
      
      const token = issueToken(result);

      return {
        ...result._doc,
        id: result._id,
        token
      }
    },

    async createOrUpdateProfilePhoto(_, { data }, context) {
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
            newProfilePhoto = result;
          })
          .catch(err => {
            throw new ApolloError(err);
          });

          userFound.profilePhoto = newProfilePhoto;
          const userUpdated = await User.update(
            { username: user.username }, 
            { profilePhoto: newProfilePhoto }
          );
          return userUpdated;
        } else {
          throw new ApolloError('User not found');
        }
      } catch (err) {
        throw new ApolloError(err);
      }
    }
  }
};