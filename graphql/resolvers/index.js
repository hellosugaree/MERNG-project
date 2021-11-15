const postsResolvers = require('./posts');
const usersResolvers = require('./users');
const catchesResolvers = require('./catches');
const locationScalarResolver = require('./locationScalar');
const cloudinaryImageScalarResolver = require('./cloudinaryImageScalar.js');
const { ApolloError } = require('apollo-server');
const User = require('../../models/User');

const getProfilePhoto = async (userId) => {
  const defaultProfilePhoto = JSON.stringify({ secure_url: '/img/icons/small/Calico-Bass-Small.png' });
  const userFound = await User.findOne({ _id: userId }, { profilePhoto: 1 });
  if (!userFound) {
    throw new ApolloError('User not found');
  }
  return userFound.profilePhoto || defaultProfilePhoto;
};

module.exports = {
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
    profilePhoto: (parent) => getProfilePhoto(parent.user),
  },
  User: {
    catchCount: (parent) => parent.catches.length,
  },
  Comment: {
    profilePhoto: (parent) => getProfilePhoto(parent.user),
  },
  Catch: {
    profilePhoto: (parent) => getProfilePhoto(parent.user),
  },

  Query: {
    ...postsResolvers.Query,
    ...catchesResolvers.Query,
    ...usersResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...catchesResolvers.Mutation
  },
  Location: locationScalarResolver,
  CloudinaryImage: cloudinaryImageScalarResolver
};