const postsResolvers = require('./posts');
const usersResolvers = require('./users');
const catchesResolvers = require('./catches');

module.exports = {
  Post: {
    // this will get run every time a post is returned from a query or mutation
    // when likeCount needs to get returned, calls function with parent (the Post being returned) as argument and returns length of likes array
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length
  },
  User : {
    catchCount: (parent) => parent.catches.length
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
  }
};