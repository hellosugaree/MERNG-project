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

export const FETCH_POSTS_QUERY = gql `
  {
    getPosts {
      id body createdAt username likeCount
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


export const LIKE_POST = gql `
  mutation likePost($postId: String!) {
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
      username
      title
      body
      createdAt
      likeCount
      commentCount
    }
  }

`;


