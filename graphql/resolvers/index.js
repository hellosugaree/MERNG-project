const postsResolvers = require('./posts');
const usersResolvers = require('./users');

module.exports = {
  Query: {
    ...postsResolvers.Query,  // gets stuff inside query from ./posts
    
    sayHi(){
      return 'hello';
    }
  },
  Mutation: {
    ...usersResolvers.Mutation, // gets Mutation from ./users
    ...postsResolvers.Mutation,

  }
};