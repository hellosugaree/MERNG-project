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
    catches: [ID]!
  }
  
  
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }



  type Catch {
    id: ID!
    username: String!
    species: String!
    fishingType: String!
    catchDate: String!
    catchLocation: String
    catchLength: Int
    notes: String
    createdAt: String!
    user: ID!
  }


  input CatchInput {
    species: String!
    fishingType: String!
    catchDate: String!
    catchLocation: String
    notes: String
    catchLength: Int
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
    likePost(postId: ID!): Post!
    createComment(postId: ID!, body: String!): Comment!
    deleteComment(postId: ID!, commentId: ID!): Comment!
    deletePost(postId: ID!): Post!
    createCatch(catchInput: CatchInput): Catch!
    deleteCatch(catchId: ID!): Catch!
  }
`;

module.exports = typeDefs;

// notes for mutation
// """rather than define all the types, we reference RegisterInput above to determine data fields"""
// """Returns a User"""

