const _ = require('lodash');
const checkAuth = require('../../utilities/check-auth');
const Catch = require('../../models/Catch');
const User = require('../../models/User');
const { validateCatchInput } = require ('../../utilities/validators');
const { UserInputError, AuthenticationError } = require('apollo-server');
const cloudinary = require('../../utilities/cloudinary');

module.exports = {
  Query: {
    async getCatches(_, { catchesToReturn = 10000, userId = null }) {
      try {
        return userId 
          ? await Catch.find({ user: userId }).limit(catchesToReturn).sort({createdAt: -1})
          : await Catch.find().limit(catchesToReturn).sort({createdAt: -1});
      } catch (err) {
        throw new Error(err);
      }
    }
  },

  Mutation: {
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
        const user = checkAuth(context);
        const { valid, errors } = validateCatchInput(species, fishingType, catchDate, catchLocation, catchLength);
        if (!valid) {
          throw new UserInputError('User input Error', errors);
        }
        let cloudinaryImages = [];
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
                const { asset_id, public_id, width, height, format, resource_type, created_at, bytes, url, secure_url } = result; 
                resolve(JSON.stringify({ asset_id, public_id, width, height, format, resource_type, created_at, bytes, url, secure_url }));
              }
            });
          })); 

          await Promise.all(uploads)
          .then(result => {
            cloudinaryImages = result;
          })
          .catch(err => {
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

        if (!userToUpdate.catches) {
          userToUpdate.catches = [];
        }

        userToUpdate.catches.unshift(newCatch.id);
        const catchSaved = await newCatch.save();
        await userToUpdate.save();
        return catchSaved;
    },

    async deleteCatch(_, { catchId }, context) {
      const user = checkAuth(context);
      const catchFound = await Catch.findById(catchId);

      if (!catchFound) {
        throw new UserInputError('A Catch with that ID does not exist')
      }

      const userFound = await User.findById(user.id);

      if (catchFound.user.toString() === user.id) {
        const catchDeleted = await Catch.findByIdAndDelete(catchId);
        if (catchDeleted) {
          const catchIndex = userFound.catches.indexOf(catchId);
          if (catchIndex > -1) {
            userFound.catches.splice(catchIndex, 1);
            await userFound.save();
            return catchDeleted;
          } else {
            throw new Error('That catch does not exist in user\'s catches');
          }
        }
        return catchDeleted;
      } else {
        throw new AuthenticationError('Not authorized to delete that catch')
      }
    }
  }
}