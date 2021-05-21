const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', err => console.log(err) );
db.once('open', () => console.log('Connected to database') );

// remove this because moved to resolvers folder
// const Post = require('./models/Post.js');
// const User = require('./models/User.js');

const resolvers = require('./graphql/resolvers/index'); // every Query needs a resolver, when you require a folder, it defaults to index.js in that folder

const typeDefs = require('./graphql/typeDefs'); // import typeDefs from other js file

// removed below because moved to typeDefs
// const gql = require('apollo-server');



const server = new ApolloServer({
  typeDefs, 
  resolvers,
  // context is an object or function that returns an object that gets automatically passed to each resolver
  // useful for things like authentication scope, etc
  context: ({ req }) => req  // context takes an object or in this case a callback that returns an object 
  // in this case context receives { req: express.Request, res: express.Response } and we destructure this as { req } in callback arguments
});


server.listen({ port: 5000 })
  .then (res => {
    console.log(`Server running at ${res.url}`);
  });

