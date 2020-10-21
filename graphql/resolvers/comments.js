const { UserInputError, AuthenticationError } = require('apollo-server');

const Post = require('../../models/Post')
const checkAuth = require('../../util/check-auth')

//*comment mutation resolvers
module.exports = {
    Mutation: {
        //* function to create comment object child of post object
        createComment: async (_, { postId, body}, context) => {
            // find user give auth token
            const { username } = checkAuth(context);
            // check for valid comment 
            if(body.trim === ''){
                throw new UserInputError('Empty comment', {
                    errors: {
                        body: 'Comment must not be empty'
                    }
                })
            }
            // find post given id function
            const post = await Post.findById(postId);

            // create and save comment object on post object
            if(post){
                post.comments.unshift({
                    body, 
                    username, 
                    createdAt: new Date().toISOString()
                })
                await post.save();
                return post;
            } else //throw err if post does not exist
            {
                throw new UserInputError('Post not found');
            }
        }, 
        //* function to delete comment object given id 
        deleteComment: async (_, { postId, commentId }, context) => {
            // get user from token
            const { username } = checkAuth(context);

            // find the post
            const post = await Post.findById(postId);
            
            if (post) {
                // find the comment in posts' comment array
                const commentIndex = post.comments.findIndex((c) => c.id === commentId);

                // check that user is trying to delete their own comment
                if (post.comments[commentIndex].username === username){
                    //cut the comment from array 
                    post.comments.splice(commentIndex, 1);
                    await post.save();
                    return post;
                } else {// non-owner is trying to delete post
                    throw new AuthenticationError('Action not allowed');
                }
            } else {
                throw new UserInputError('Post not found');
            }
        }
    }
};