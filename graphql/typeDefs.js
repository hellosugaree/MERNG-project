const { gql } = require('apollo-server');

const typeDefs = gql`

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
    profilePhoto: CloudinaryImage
  }

  type Comment {
    id: ID!
    username: String!
    body: String!
    createdAt: String!
    user: ID!
    profilePhoto: CloudinaryImage
  }

  type Like {
    id: ID!
    username: String!
    createdAt: String!
  }

  scalar Location
  scalar CloudinaryImage

  type CloudinaryImageObject {
    id: ID!
    asset_id: String
  }

  type UserPreferences {
    profilePicture: CloudinaryImageObject
  }

  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
    catches: [ID]!
    catchCount: Int!
    # preferences: UserPreferences
    profilePhoto: CloudinaryImage
    # biggestCatch: Int
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
    catchDate: String
    catchLocation: Location
    catchLength: Int
    notes: String
    images: [CloudinaryImage]
    createdAt: String!
    user: ID!
    profilePhoto: CloudinaryImage
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
    createOrUpdateProfilePhoto(data: String!): User!
  }
`;

module.exports = typeDefs;