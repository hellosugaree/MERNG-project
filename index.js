const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', err => console.log(err) );
db.once('open', () => console.log('Connected to database') );
const resolvers = require('./graphql/resolvers/index');
const typeDefs = require('./graphql/typeDefs'); 

const server = new ApolloServer({
  typeDefs, 
  resolvers,
  context: ({ req }) => req
});

server.listen({ port: 5000 })
  .then (res => {
    console.log(`Server running at ${res.url}`);
  });

