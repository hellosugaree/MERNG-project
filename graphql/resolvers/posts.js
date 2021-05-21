const Post = require('../../models/Post');
const Like = require('../../models/Like');
const Comment = require('../../models/Comment');
const checkAuth = require('../../utilities/check-auth'); // import auth check function
const { UserInputError, AuthenticationError } = require('apollo-server');
const { validateCommentInput, validatePostInput } = require('../../utilities/validators');

module.exports = {
  Query: {
    async getPosts(_, { postsToReturn = 200 }){ // return 200 by default if no value specified in query
      try {
        // sort posts by createdAt to put newest posts first in array
        const posts = await Post.find().limit(postsToReturn).sort({ createdAt: -1 }); 
        return posts;
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
      // check authorization token via checkAuth function in utilities
      const user = checkAuth(context);
      // if code gets to this point, there were no errors from checkAuth so a user definitely exists
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
        if (postFound.username === user.username) {  // make sure person trying to delete is person who created post
          await postFound.delete();
          return postFound;
        } else {
          throw new AuthenticationError('Not authorized to delete post');
        }
      } catch (err) {
        console.log('Post not found');
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
          username: user.username,
          body,
          createdAt: new Date().toISOString()
        });        
        postFound.comments.unshift(newComment);
        await postFound.save();
        return newComment;
      } else {
        console.log('Post not found');
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
              postFound.comments.splice(commentIndex, 1); // delete the comment
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
          // already existing like by this user
          postFound.likes.splice(likeIndex, 1);
        } else {
          // no existing like by this user
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