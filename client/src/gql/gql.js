import { gql } from '@apollo/client';

export const LOGIN_USER = gql `
  mutation login(
    $username: String!
    $password: String!
  ) {
    login( username: $username, password: $password ) {
      id
      username
      email
      token
    }
  }
`;



// note, the name behind the query names the query data in your apollo cache
export const FETCH_POSTS_QUERY = gql `
  query getPosts {
    getPosts {
      id 
      body 
      createdAt 
      username 
      likeCount 
      title
      likes {
        username
      }
      commentCount
      comments {
        id 
        username 
        createdAt 
        body
      }
    }
  }
`;


export const LIKE_POST = gql `
  mutation likePost($postId: ID!) {
    likePost(postId: $postId){
      id
      likeCount
    }
  }
`;

export const CREATE_POST = gql `
  mutation createPost($title: String!, $body: String!){
    createPost(title: $title, body: $body){
      id 
      body 
      createdAt 
      username 
      likeCount 
      title
      likes {
        username
      }
      commentCount
      comments {
        id username createdAt body
      }
    }
  }
`;

export const DELETE_POST = gql `
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId){
      id 
      body 
      createdAt 
      username 
      likeCount 
      title
      likes {
        username
      }
      commentCount
      comments {
        id username createdAt body
      }
    }
  }
`;


export const CREATE_COMMENT = gql `
  mutation createComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      username
      body
      createdAt
    }
  }
`;

export const DELETE_COMMENT = gql `
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      username
      body
      createdAt
    }
  }
`;

export const REGISTER_USER = gql `
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register (registerInput: {
      username: $username 
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    }) {
      id
      username
      email
      token
      createdAt
    }
  }
`;



export const CREATE_CATCH = gql `
  mutation createCatch(   
    $species: String!,
    $fishingType: String!,
    $catchDate: String!,
    $catchLocation: String,
    $catchLength: Int,
    $notes: String
  ) {
    createCatch(catchInput: {
      species: $species,
      fishingType: $fishingType,
      catchDate: $catchDate,
      catchLocation: $catchLocation,
      catchLength: $catchLength,
      notes: $notes
    }) {
      user
      username
      createdAt
      species
      fishingType
      catchDate
      catchLocation
      catchLength
      notes
    }
  }
`;

// userId is optional if you want to query a specific user's catches
export const GET_CATCHES = gql `
  query getCatches($catchesToReturn: Int, $userId: ID) {
    getCatches(userId: $userId, catchesToReturn: $catchesToReturn) {
      id
      user
      username
      species
      fishingType
      catchDate
      catchLocation
      catchLength
      notes
      createdAt
    }
  }
`;


export const GET_USER_BASIC_DATA = gql `

  query getUser($userId: ID) {
    getUser(userId: $userId) {
      username
      catches
      catchCount
      createdAt
    }
  }

`;
