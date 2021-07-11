 const { gql } = require('apollo-server');

// ! means required in typeDefs
const typeDefs = gql`
  """comment"""
  type Post {
    id: ID!
    user: ID!
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
    user: ID!
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
    catchCount: Int!
    # biggestCatch: Int
  }
  
  
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  # Custom scalar for location { lat: <number>, lng: <number> }
  scalar Location
  scalar CloudinaryImage

  type Catch {
    id: ID!
    username: String!
    species: String!
    fishingType: String!
    catchDate: String
    catchLocation: Location
    catchLength: Int
    notes: String
    images: [CloudinaryImage]
    createdAt: String!
    user: ID!

  }


  input CatchInput {
    species: String!
    fishingType: String!
    catchDate: String!
    catchLength: Int
    catchLocation: Location
    images: [String]
    notes: String
  }

  type Query {
    sayHi: String!
    getPosts(postsToReturn: Int, userId: ID): [Post]
    getPost(postId: ID!): Post
    getCatches(catchesToReturn: Int, userId: ID): [Catch]
    getUser(userId: ID): User
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


