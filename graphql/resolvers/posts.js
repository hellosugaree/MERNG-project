const Post = require('../../models/Post');
const Like = require('../../models/Like');
const Comment = require('../../models/Comment');
const checkAuth = require('../../utilities/check-auth');
const { UserInputError, AuthenticationError } = require('apollo-server');
const { validateCommentInput, validatePostInput } = require('../../utilities/validators');

module.exports = {
  Query: {
    async getPosts(_, { postsToReturn = 200, userId = null }){
      try {
        return userId 
          ? await Post.find({user: userId}).limit(postsToReturn).sort({ createdAt: -1 }) 
          : await Post.find().limit(postsToReturn).sort({ createdAt: -1 }); 
      } catch (err) {
        throw new Error(err);
      }
    },
    
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error('Post not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },

  Mutation: {
    async createPost(_, { title, body }, context) {
      const user = checkAuth(context);
      const { errors, valid } = validatePostInput(title, body);
      if (!valid) {
        throw new UserInputError('User input error', errors);
      }
      const newPost = new Post ({
        user: user.id,
        username: user.username,
        title,
        body,
        createdAt: new Date().toISOString()
      });
      const post = await newPost.save();
      return post;
    },
  
    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);
      try {
        const postFound = await Post.findById(postId);
        if (postFound.username === user.username) {
          const postDeleted = await postFound.delete();
          return postDeleted;
        } else {
          throw new AuthenticationError('Not authorized to delete post');
        }
      } catch (err) {
        throw new Error(err);
      }
    },

    async createComment(_, { postId, body }, context) {
      const { valid, errors } = validateCommentInput(body);
      if (!valid) {
        throw new UserInputError('User input error', errors);
      }
      const user = checkAuth(context);
      const postFound = await Post.findById(postId);
      if (postFound) {
        const newComment = new Comment({
          user: user.id,
          username: user.username,
          body,
          createdAt: new Date().toISOString()
        });  
        postFound.comments.unshift(newComment);
        await postFound.save();
        return newComment;
      } else {
        throw new UserInputError('Post not found');
      }
    },

    async deleteComment(_, { postId, commentId }, context) {
      const user = checkAuth(context);
        const postFound = await Post.findById(postId);
        if (postFound) {
          const commentIndex = postFound.comments.findIndex(comment => comment.id === commentId);
          const commentFound = postFound.comments[commentIndex];
          if (commentFound){
            if (commentFound.username === user.username) {
              postFound.comments.splice(commentIndex, 1);
              await postFound.save();
              return commentFound;
            } else {
              throw new AuthenticationError('Not authorized to delete comment');
            }
          } else {
            throw new UserInputError('Comment not found');
          }
        } else {
          throw new UserInputError('Post not found');
       }          
    },

    async likePost (_, { postId }, context) {
      const user = checkAuth(context);
      const postFound = await Post.findById(postId);
      if (postFound) {
        const likeIndex = postFound.likes.findIndex(like => like.username === user.username);
        if (likeIndex > -1) {
          postFound.likes.splice(likeIndex, 1);
        } else {
          const newLike = new Like({
            username: user.username,
            createdAt: new Date().toISOString()
          });
          postFound.likes.unshift(newLike);
        }
        await postFound.save();
        return postFound;
      } else {
        throw new UserInputError('Post not found')
      }
    }
  }
};