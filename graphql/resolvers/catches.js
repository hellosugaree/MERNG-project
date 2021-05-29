const checkAuth = require('../../utilities/check-auth');
const Catch = require('../../models/Catch');
const User = require('../../models/User');
const { validateCatchInput } = require ('../../utilities/validators');
const { UserInputError, AuthenticationError } = require('apollo-server');
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
    async getCatches(_, { catchesToReturn = 200, userId = null }) {
      try {
        // different handling depending on whether or not a userId is supplied
        const catches = userId 
          ? await Catch.find({user: userId}).limit(catchesToReturn).sort({createdAt: -1})
          : await Catch.find().limit(catchesToReturn).sort({createdAt: -1});
          console.log(catches);
          return catches;
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
          notes
        }
      }, 
      context) {
        console.log('Processing createCatch on server');
        const { valid, errors } = validateCatchInput(species, fishingType, catchDate, catchLocation, catchLength);
        if (!valid) {
          throw new UserInputError('User input Error', errors);
        }
        console.log('passed catch validation')
        // check context for authorization token in header
        const user = checkAuth(context);
        // create a new catch

        const newCatch = new Catch({
          username: user.username,
          user: user.id,
          species,
          fishingType,
          catchDate,
          catchLocation: catchLocation || null,
          createdAt: new Date().toISOString(),
          notes: notes || null,
          catchLength: catchLength || null
        });
        const userToUpdate = await User.findById(user.id);
        // handle users that were added before the catches field existed
        if (!userToUpdate.catches) {
          userToUpdate.catches = [];
        }
        // add the new catch to this user's catches
        userToUpdate.catches.unshift(newCatch.id);
        console.log(userToUpdate);
        console.log(newCatch);
        // save the newly created catch
        const catchSaved = await newCatch.save();
        // save the updated user
        await userToUpdate.save();
        console.log(catchSaved);
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
        console.log(catchDeleted);
        return catchDeleted;
      } else {
        // trying to delete someone else's catch
        throw new AuthenticationError('Not authorized to delete that catch')
      }
      
    }
    
  }

}