const _ = require('lodash');
const checkAuth = require('../../utilities/check-auth');
const Catch = require('../../models/Catch');
const User = require('../../models/User');
const { validateCatchInput } = require ('../../utilities/validators');
const { UserInputError, AuthenticationError } = require('apollo-server');
// const { ApolloError } = require('apollo-server-errors');
const cloudinary = require('../../utilities/cloudinary');

/*
For logging fish catches
fields: {
  username: String!
  id: ID!
  fishingType: String! (onshore, inshore, offshore)
  species: String! select single from list of species
  sessionId: ID (optional)
  catchLocation: String (optional)
  catchDate: String! (date selected from calendar)
  createdAt: String! (date on doc creation)
}


when a session is logged, all fish from that session will be stored as individual catches since a session is not required for a catch
catches in that session will be logged in an array of IDs for each catch document

for logging sessions
fields: {
  username: String!
  catches: [catchIds]
  singleDay: Bool!
  speciesTargeted: [select from list of species]
  speciesCaught: [taken from catchIds]
  sessionStart: String! 
  createdAt: String! (date on doc creation)

}

*/


module.exports = {

  Query: {
    async getCatches(_, { catchesToReturn = 10000, userId = null }) {
      try {
        return userId 
          ? await Catch.find({ user: userId }).limit(catchesToReturn).sort({createdAt: -1})
          : await Catch.find().limit(catchesToReturn).sort({createdAt: -1});

        // return extendProfilePhoto(catches, 'user');
      } catch (err) {
        throw new Error(err);
      }
    }
  },

  Mutation: {
    // create a new catch
    async createCatch (_, 
      { catchInput: 
        { species,
          fishingType,
          catchDate,
          catchLocation,
          catchLength,
          images,
          notes
        }
      }, 
      context) {
        console.log('Processing createCatch on server');

        // check context for authorization token in header
        const user = checkAuth(context);
        console.log(user);
        
        const { valid, errors } = validateCatchInput(species, fishingType, catchDate, catchLocation, catchLength);
        if (!valid) {
          throw new UserInputError('User input Error', errors);
        }
        console.log('passed catch validation')

        // create a new catch

        // hold any cloudinary image objects if we successfully upload images
        let cloudinaryImages = [];
        // upload images if they exist
        if (images.length > 0) {
          const uploads = images.map(image => new Promise((resolve, reject) => {
            cloudinary.uploader.upload(image, {
              folder: 'catch_images',
              resource_type: 'image',
              uploadPreset: 'fs_signed_upload'
            }, (error, result) => {
              if (error) {
                reject(error);
              } else {
                console.log(result);
                const { asset_id, public_id, width, height, format, resource_type, created_at, bytes, url, secure_url } = result; 
                resolve(JSON.stringify({ asset_id, public_id, width, height, format, resource_type, created_at, bytes, url, secure_url }));
              }
            });
          })); 

          await Promise.all(uploads)
          .then(result => {
            console.log('resolve');
            console.log(result);
            cloudinaryImages = result;
          })
          .catch(err => {
            console.log('error');
            console.log(err)
          });
        }

        /*  sample cloudinary response
                {
                  asset_id: '74ef68cc939d1c9f4240dd46ab94334c',     
                  public_id: 'catch_images/vjteagfrt6opxzfh271i',   
                  version: 1626034602,
                  version_id: '28664ea3d7bd972c6d63545e477e57e2',   
                  signature: 'a37452af49a93ad2a05bd3f71a97adec84cdaa56',
                  width: 598,
                  height: 587,
                  format: 'png',
                  resource_type: 'image',
                  created_at: '2021-07-11T20:16:42Z',
                  tags: [],
                  bytes: 105945,
                  type: 'upload',
                  etag: '190b3c66d0b7f5ec367ec16df73253cd',
                  placeholder: false,
                  url: 'http://res.cloudinary.com/dqdt8249b/image/upload/v1626034602/catch_images/vjteagfrt6opxzfh271i.png',
                  secure_url: 'https://res.cloudinary.com/dqdt8249b/image/upload/v1626034602/catch_images/vjteagfrt6opxzfh271i.png',
                  access_mode: 'public',
                  api_key: '**************'
                }
        */
        console.log('cloudinaryImages')
        console.log(cloudinaryImages)
        const newCatch = new Catch({
          username: user.username,
          user: user.id,
          species,
          fishingType,
          catchDate,
          catchLocation: catchLocation,
          createdAt: new Date().toISOString(),
          notes: notes || null,
          catchLength: catchLength || null,
          images: cloudinaryImages
        });
        const userToUpdate = await User.findById(user.id);
        // handle users that were added before the catches field existed
        if (!userToUpdate.catches) {
          userToUpdate.catches = [];
        }
        // add the new catch to this user's catches
        userToUpdate.catches.unshift(newCatch.id);
        // console.log(userToUpdate);
        // console.log(newCatch);
        // save the newly created catch
        const catchSaved = await newCatch.save();
        // save the updated user
        await userToUpdate.save();
        // console.log(catchSaved);
        return catchSaved;
    },

    async deleteCatch(_, { catchId }, context) {
      const user = checkAuth(context);
      const catchFound = await Catch.findById(catchId);
      if (!catchFound) {
        throw new UserInputError('A Catch with that ID does not exist')
      }
      const userFound = await User.findById(user.id);

      // make sure catch being deleted was created by currently logged in user
      if (catchFound.user.toString() === user.id) {
        const catchDeleted = await Catch.findByIdAndDelete(catchId);
        if (catchDeleted) {
          // delete the catch from user's catches array
          // find the index of catch in user's catches array
          const catchIndex = userFound.catches.indexOf(catchId);
          if (catchIndex > -1) {
            // splice out the index with that catch from the user's catches array
            userFound.catches.splice(catchIndex, 1);
            // save the updated user data
            await userFound.save();
            console.log('updated user\'s catches');
            return catchDeleted;
          } else {
            // tried to delete a catch that doesn't exist in user's catches array
            throw new Error('That catch does not exist in user\'s catches');
          }
        }
        
        // outside of callback
        console.log('outside callback')
        // console.log(catchDeleted);
        return catchDeleted;
      } else {
        // trying to delete someone else's catch
        throw new AuthenticationError('Not authorized to delete that catch')
      }
      
    }
    
  }

}