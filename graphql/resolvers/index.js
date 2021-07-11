const postsResolvers = require('./posts');
const usersResolvers = require('./users');
const catchesResolvers = require('./catches');
const locationScalarResolver = require('./locationScalar');
const cloudinaryImageScalarResolver = require('./cloudinaryImageScalar.js');

// const calculateBiggestCatch = catches => {
//   if (catches.length > 0) {
//     const biggestCatch = Math.max(...catches.filter(thisCatch => typeof thisCatch.catchLength === 'number').map(thisCatch => thisCatch.catchLength));
//     console.log(biggestCatch);
//     return biggestCatch > 0 ? biggestCatch: null;
//   } 
// }

module.exports = {
  Post: {
    // this will get run every time a post is returned from a query or mutation
    // when likeCount needs to get returned, calls function with parent (the Post being returned) as argument and returns length of likes array
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length
  },
  User : {
    catchCount: (parent) => parent.catches.length,
    // biggestCatch: parent => calculateBiggestCatch(parent.catches)
  },

  Query: {
    ...postsResolvers.Query,  // gets stuff inside query from ./posts
    ...catchesResolvers.Query,
    ...usersResolvers.Query,
    
    sayHi(){
      return 'hello';
    }
  },
  Mutation: {
    ...usersResolvers.Mutation, // gets Mutation from ./users
    ...postsResolvers.Mutation,
    ...catchesResolvers.Mutation
  },
  Location: locationScalarResolver,
  CloudinaryImage: cloudinaryImageScalarResolver
};