 const { gql } = require('apollo-server');

// ! means required in typeDefs
const typeDefs = gql`
  """comment"""
  type Post {
    id: ID!
    username: String!
    title: String
    body: String!
    createdAt: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }

  type Comment {
    id: ID!
    username: String!
    body: String!
    createdAt: String!
  }

  type Like {
    id: ID!
    username: String!
    createdAt: String!
  }

  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }
  
  
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  type Query {
    sayHi: String!
    getPosts(postsToReturn: Int): [Post]
    getPost(postId: ID!): Post
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(title: String!, body: String!): Post!
    likePost(postId: String!): Post!
    createComment(postId: ID!, body: String!): Comment!
    deleteComment(postId: ID!, commentId: ID!): Comment!
    deletePost(postId: ID!): Post!
  }



  `;

module.exports = typeDefs;

// notes for mutation
// """rather than define all the types, we reference RegisterInput above to determine data fields"""
// """Returns a User"""